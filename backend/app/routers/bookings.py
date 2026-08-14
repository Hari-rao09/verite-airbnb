from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking, Listing, User, ListingPhoto
from app.schemas.booking import (
    BookingCreate,
    BookingResponse,
    HostReservationResponse,
    HostListingInfo,
    HostGuestInfo,
    BookingStatusUpdate,
)
from app.security import get_current_user


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check listing exists
    listing = db.query(Listing).filter(
        Listing.id == booking.listing_id,
        Listing.is_active == 1
    ).first()

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    # Validate dates
    if booking.check_in >= booking.check_out:
        raise HTTPException(
            status_code=400,
            detail="Check-out must be after check-in"
        )

    # Validate number of guests
    if booking.guests <= 0:
        raise HTTPException(
            status_code=400,
            detail="Guests must be at least 1"
        )

    if booking.guests > listing.max_guests:
        raise HTTPException(
            status_code=400,
            detail="Number of guests exceeds listing capacity"
        )

    # Check for overlapping bookings
    overlapping_booking = db.query(Booking).filter(
        Booking.listing_id == booking.listing_id,
        Booking.status == "confirmed",
        Booking.check_in < booking.check_out,
        Booking.check_out > booking.check_in
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=409,
            detail="Listing is already booked for these dates"
        )

    # Calculate number of nights
    nights = (booking.check_out - booking.check_in).days

    # Calculate total price
    total_price = nights * listing.price_per_night

    # Create booking
    new_booking = Booking(
        guest_id=current_user.id,
        listing_id=booking.listing_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests=booking.guests,
        total_price=total_price,
        status="confirmed"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


@router.get("/me", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(
        Booking.guest_id == current_user.id
    ).all()


@router.get("/host", response_model=List[HostReservationResponse])
def get_host_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find all listings owned by current_user
    host_listings = db.query(Listing).filter(Listing.host_id == current_user.id).all()
    if not host_listings:
        return []

    host_listing_ids = [l.id for l in host_listings]
    listing_map = {l.id: l for l in host_listings}

    # Query bookings for these listings
    bookings = db.query(Booking).filter(
        Booking.listing_id.in_(host_listing_ids)
    ).order_by(Booking.check_in.desc()).all()

    if not bookings:
        return []

    # Get guests info
    guest_ids = list(set([b.guest_id for b in bookings]))
    guests = db.query(User).filter(User.id.in_(guest_ids)).all()
    guest_map = {g.id: g for g in guests}

    # Get primary photos for listings
    photos = db.query(ListingPhoto).filter(
        ListingPhoto.listing_id.in_(host_listing_ids),
        ListingPhoto.display_order == 0
    ).all()
    photo_map = {p.listing_id: p.image_url for p in photos}

    results = []
    for b in bookings:
        lst = listing_map.get(b.listing_id)
        gst = guest_map.get(b.guest_id)
        if not lst:
            continue

        guest_info = HostGuestInfo(
            id=gst.id if gst else b.guest_id,
            name=gst.name if gst else "Guest",
            email=gst.email if gst else "guest@airclone.com",
        )

        listing_info = HostListingInfo(
            id=lst.id,
            title=lst.title,
            location=lst.location,
            property_type=lst.property_type,
            price_per_night=lst.price_per_night,
            image_url=photo_map.get(lst.id, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"),
        )

        nights = max(1, (b.check_out - b.check_in).days)

        results.append(
            HostReservationResponse(
                id=b.id,
                guest_id=b.guest_id,
                listing_id=b.listing_id,
                check_in=b.check_in,
                check_out=b.check_out,
                guests=b.guests,
                total_price=b.total_price,
                status=b.status,
                nights=nights,
                listing=listing_info,
                guest=guest_info,
            )
        )

    return results


@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    status_update: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
    if not listing or listing.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only manage reservations for your own listings")

    valid_statuses = ["confirmed", "completed", "cancelled", "pending"]
    new_status = status_update.status.lower()
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    booking.status = new_status
    db.commit()
    db.refresh(booking)
    return booking
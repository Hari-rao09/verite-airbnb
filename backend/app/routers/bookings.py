from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking, Listing, User
from app.schemas.booking import BookingCreate, BookingResponse
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


@router.get("/me", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(
        Booking.guest_id == current_user.id
    ).all()
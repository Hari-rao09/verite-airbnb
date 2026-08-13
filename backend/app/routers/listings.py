from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Listing, User, ListingPhoto
from app.schemas.listing import ListingCreate, ListingResponse
from app.security import get_current_user


router = APIRouter(
    prefix="/listings",
    tags=["Listings"]
)


@router.post("/", response_model=ListingResponse)
def create_listing(
    listing: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_listing = Listing(
        title=listing.title,
        description=listing.description,
        property_type=listing.property_type,
        price_per_night=listing.price_per_night,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        bathrooms=listing.bathrooms,
        location=listing.location,
        host_id=current_user.id
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return {
        **new_listing.__dict__,
        "photos": []
    }


@router.get("/", response_model=list[ListingResponse])
def get_listings(
    location: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    guests: int | None = None,
    property_type: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(
        Listing.is_active == 1
    )

    if location:
        query = query.filter(
            Listing.location.ilike(f"%{location}%")
        )

    if min_price is not None:
        query = query.filter(
            Listing.price_per_night >= min_price
        )

    if max_price is not None:
        query = query.filter(
            Listing.price_per_night <= max_price
        )

    if guests is not None:
        query = query.filter(
            Listing.max_guests >= guests
        )

    if property_type:
        query = query.filter(
            Listing.property_type.ilike(f"%{property_type}%")
        )

    listings = query.all()

    result = []

    for listing in listings:
        photos = db.query(ListingPhoto).filter(
            ListingPhoto.listing_id == listing.id
        ).order_by(
            ListingPhoto.display_order
        ).all()

        result.append({
            **listing.__dict__,
            "photos": photos
        })

    return result


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.is_active == 1
    ).first()

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    photos = db.query(ListingPhoto).filter(
        ListingPhoto.listing_id == listing_id
    ).order_by(
        ListingPhoto.display_order
    ).all()

    return {
        **listing.__dict__,
        "photos": photos
    }

@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.host_id == current_user.id
    ).first()

    if not existing_listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    existing_listing.title = listing.title
    existing_listing.description = listing.description
    existing_listing.property_type = listing.property_type
    existing_listing.price_per_night = listing.price_per_night
    existing_listing.max_guests = listing.max_guests
    existing_listing.bedrooms = listing.bedrooms
    existing_listing.beds = listing.beds
    existing_listing.bathrooms = listing.bathrooms
    existing_listing.location = listing.location

    db.commit()
    db.refresh(existing_listing)

    photos = db.query(ListingPhoto).filter(
        ListingPhoto.listing_id == listing_id
    ).order_by(
        ListingPhoto.display_order
    ).all()

    return {
        **existing_listing.__dict__,
        "photos": photos
    }

@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.host_id == current_user.id
    ).first()

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found or you are not the owner"
        )

    # Soft delete
    listing.is_active = 0

    db.commit()

    return {
        "message": "Listing deleted successfully"
    }
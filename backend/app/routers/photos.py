from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Listing, ListingPhoto, User
from app.schemas.photo import PhotoCreate, PhotoResponse
from app.security import get_current_user


router = APIRouter(
    prefix="/listings",
    tags=["Listing Photos"]
)


@router.post("/{listing_id}/photos", response_model=PhotoResponse)
def add_photo(
    listing_id: int,
    photo: PhotoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id
    ).first()

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    if listing.host_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not the owner of this listing"
        )

    new_photo = ListingPhoto(
        listing_id=listing_id,
        image_url=photo.image_url,
        display_order=photo.display_order
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return new_photo


@router.get("/{listing_id}/photos", response_model=list[PhotoResponse])
def get_photos(
    listing_id: int,
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id
    ).first()

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    return db.query(ListingPhoto).filter(
        ListingPhoto.listing_id == listing_id
    ).order_by(ListingPhoto.display_order).all()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.wishlist import Wishlist
from app.models.listing import Listing
from app.security import get_current_user
from app.schemas.wishlist import WishlistResponse


router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"]
)


# Add listing to wishlist
@router.post(
    "/{listing_id}",
    response_model=WishlistResponse
)
def add_to_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Check that listing exists
    listing = (
        db.query(Listing)
        .filter(Listing.id == listing_id)
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    # Check if already saved
    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id,
            Wishlist.listing_id == listing_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Listing already in wishlist"
        )

    wishlist = Wishlist(
        user_id=current_user.id,
        listing_id=listing_id
    )

    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)

    return wishlist


# Remove listing from wishlist
@router.delete("/{listing_id}")
def remove_from_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    wishlist = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id,
            Wishlist.listing_id == listing_id
        )
        .first()
    )

    if not wishlist:
        raise HTTPException(
            status_code=404,
            detail="Listing not in wishlist"
        )

    db.delete(wishlist)
    db.commit()

    return {
        "message": "Listing removed from wishlist"
    }


# Get current user's wishlist
@router.get(
    "/",
    response_model=list[WishlistResponse]
)
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    wishlist = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id
        )
        .all()
    )

    return wishlist
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Review
from app.schemas.review import ReviewCreate, ReviewResponse
from app.security import get_current_user

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post("/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_review = Review(
        guest_id=current_user.id,
        listing_id=review.listing_id,
        rating=review.rating,
        comment=review.comment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review


@router.get("/listing/{listing_id}", response_model=list[ReviewResponse])
def get_listing_reviews(
    listing_id: int,
    db: Session = Depends(get_db)
):
    reviews = (
        db.query(Review)
        .filter(Review.listing_id == listing_id)
        .all()
    )

    return reviews
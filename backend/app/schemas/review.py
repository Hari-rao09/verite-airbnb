from pydantic import BaseModel


class ReviewCreate(BaseModel):
    listing_id: int
    rating: int
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: int
    guest_id: int
    listing_id: int
    rating: int
    comment: str | None = None

    class Config:
        from_attributes = True
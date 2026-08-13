from pydantic import BaseModel


class WishlistResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int

    class Config:
        from_attributes = True
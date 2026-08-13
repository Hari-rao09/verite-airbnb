from pydantic import BaseModel


class PhotoCreate(BaseModel):
    image_url: str
    display_order: int = 0


class PhotoResponse(BaseModel):
    id: int
    listing_id: int
    image_url: str
    display_order: int

    class Config:
        from_attributes = True
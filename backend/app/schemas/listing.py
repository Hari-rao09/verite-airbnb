from pydantic import BaseModel


class ListingCreate(BaseModel):
    title: str
    description: str
    property_type: str
    price_per_night: float
    max_guests: int
    bedrooms: int = 1
    beds: int = 1
    bathrooms: int = 1
    location: str


class ListingPhotoResponse(BaseModel):
    id: int
    listing_id: int
    image_url: str
    display_order: int

    class Config:
        from_attributes = True


class ListingResponse(BaseModel):
    id: int
    title: str
    description: str
    property_type: str
    price_per_night: float
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: int
    location: str
    host_id: int
    is_active: int

    photos: list[ListingPhotoResponse] = []

    class Config:
        from_attributes = True
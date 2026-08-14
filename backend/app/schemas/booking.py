from datetime import date
from typing import Optional
from pydantic import BaseModel


class BookingCreate(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests: int


class BookingResponse(BaseModel):
    id: int
    guest_id: int
    listing_id: int
    check_in: date
    check_out: date
    guests: int
    total_price: float
    status: str

    class Config:
        from_attributes = True


class BookedDateRange(BaseModel):
    id: int
    check_in: date
    check_out: date

    class Config:
        from_attributes = True


class HostListingInfo(BaseModel):
    id: int
    title: str
    location: str
    property_type: str
    price_per_night: float
    image_url: Optional[str] = None


class HostGuestInfo(BaseModel):
    id: int
    name: str
    email: str


class HostReservationResponse(BaseModel):
    id: int
    guest_id: int
    listing_id: int
    check_in: date
    check_out: date
    guests: int
    total_price: float
    status: str
    nights: int
    listing: HostListingInfo
    guest: HostGuestInfo

    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    status: str
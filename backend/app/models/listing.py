from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)

    # Basic information
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    # Property details
    property_type = Column(String(50), nullable=False)
    price_per_night = Column(Float, nullable=False)
    max_guests = Column(Integer, nullable=False)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    bathrooms = Column(Integer, default=1)

    # Location
    location = Column(String(200), nullable=False)

    # Host
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Listing status
    is_active = Column(Integer, default=1)
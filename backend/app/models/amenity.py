from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)


class ListingAmenity(Base):
    __tablename__ = "listing_amenities"

    id = Column(Integer, primary_key=True, index=True)

    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False
    )

    amenity_id = Column(
        Integer,
        ForeignKey("amenities.id"),
        nullable=False
    )
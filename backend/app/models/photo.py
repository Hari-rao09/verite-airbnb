from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    id = Column(Integer, primary_key=True, index=True)

    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False
    )

    image_url = Column(String(500), nullable=False)

    display_order = Column(Integer, default=0)
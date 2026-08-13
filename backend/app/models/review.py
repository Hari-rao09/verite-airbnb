from sqlalchemy import Column, Integer, Text, ForeignKey
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    guest_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False
    )

    rating = Column(Integer, nullable=False)

    comment = Column(Text, nullable=True)
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    # Who is booking?
    guest_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # What listing is being booked?
    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False
    )

    # Booking dates
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)

    # Number of guests
    guests = Column(Integer, nullable=False)

    # Total amount for the booking
    total_price = Column(Float, nullable=False)

    # Booking status
    status = Column(String(30), default="confirmed")
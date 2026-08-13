from fastapi import FastAPI
from app.routers import auth
from app.database import Base, engine
from app.models import (
    User,
    Listing,
    ListingPhoto,
    Amenity,
    ListingAmenity,
    Booking,
    Review,
    wishlist,
)
# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AirClone API",
    description="Backend API for the AirClone Airbnb assignment",
    version="1.0.0",
)
app.include_router(auth.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
from fastapi import FastAPI
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from app.routers.wishlist import router as wishlist_router
from app.routers.reviews import router as reviews_router
from app.routers.bookings import router as bookings_router
from app.routers.photos import router as photos_router
from app.routers.listings import router as listings_router
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
    swagger_ui_parameters={
        "persistAuthorization": True
    }
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(listings_router)
app.include_router(photos_router)
app.include_router(bookings_router)
app.include_router(reviews_router)
app.include_router(wishlist_router)



@app.get("/health")
def health_check():
    return {"status": "ok"}
"""
Database Seeding Script for AirClone
Populates SQLite database with sample hosts, guests, listings, multi-photo galleries,
amenities, bookings, and verified guest reviews.

Usage:
    cd backend
    python -m app.seed
    # or
    python app/seed.py
"""

import sys
import os
from datetime import date, datetime

# Allow execution from root or backend directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from passlib.context import CryptContext
from app.database import Base, engine, SessionLocal
from app.models import (
    User,
    Listing,
    ListingPhoto,
    Amenity,
    ListingAmenity,
    Booking,
    Review,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_database():
    print("[*] Starting AirClone Database Seeding...")

    # Create all tables if not present
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded to prevent duplicate key errors
        existing_hosts = db.query(User).filter(User.email.in_([
            "host@airclone.com",
            "host2@airclone.com",
            "host3@airclone.com",
            "guest@airclone.com",
        ])).all()

        if existing_hosts:
            print("[!] Sample users found in database. Cleaning up previous seed data...")
            db.query(Review).delete()
            db.query(Booking).delete()
            db.query(ListingAmenity).delete()
            db.query(ListingPhoto).delete()
            db.query(Listing).delete()
            db.query(Amenity).delete()
            db.query(User).delete()
            db.commit()
            print("[+] Cleaned up old data.")

        # =========================================================================
        # 1. SEED USERS (Hosts & Guests)
        # =========================================================================
        print("[+] Creating Sample Users & Hosts...")
        default_pw = pwd_context.hash("password123")

        users_data = [
            {
                "name": "Vaibhav Walia (Superhost)",
                "email": "host@airclone.com",
                "password_hash": default_pw,
                "is_host": True,
                "created_at": datetime.now().isoformat(),
            },
            {
                "name": "Priya Sharma",
                "email": "host2@airclone.com",
                "password_hash": default_pw,
                "is_host": True,
                "created_at": datetime.now().isoformat(),
            },
            {
                "name": "Arjun Mehta",
                "email": "host3@airclone.com",
                "password_hash": default_pw,
                "is_host": True,
                "created_at": datetime.now().isoformat(),
            },
            {
                "name": "Rahul Verma",
                "email": "guest@airclone.com",
                "password_hash": default_pw,
                "is_host": False,
                "created_at": datetime.now().isoformat(),
            },
            {
                "name": "Sneha Patel",
                "email": "guest2@airclone.com",
                "password_hash": default_pw,
                "is_host": False,
                "created_at": datetime.now().isoformat(),
            },
        ]

        created_users = {}
        for u in users_data:
            user_obj = User(**u)
            db.add(user_obj)
            db.commit()
            db.refresh(user_obj)
            created_users[u["email"]] = user_obj

        print(f"[+] Created {len(created_users)} users (Hosts: host@airclone.com, host2@airclone.com, host3@airclone.com / Password: password123)")

        # =========================================================================
        # 2. SEED AMENITIES
        # =========================================================================
        print("[+] Creating Amenities...")
        amenities_names = [
            "Wifi",
            "Kitchen",
            "Air conditioning",
            "Free parking on premises",
            "TV",
            "Private pool",
            "Dedicated workspace",
            "Washing machine",
            "Balcony / Patio",
            "Smoke alarm",
            "Carbon monoxide alarm",
            "First aid kit",
            "Hair dryer",
            "Coffee maker",
            "Refrigerator",
        ]

        amenity_map = {}
        for name in amenities_names:
            amenity = Amenity(name=name)
            db.add(amenity)
            db.commit()
            db.refresh(amenity)
            amenity_map[name] = amenity.id

        print(f"[+] Created {len(amenity_map)} amenities.")

        # =========================================================================
        # 3. SEED LISTINGS (10 Distinct Properties with Photos)
        # =========================================================================
        print("[+] Creating 10 Diverse Listings with Multi-Photo Galleries...")

        listings_data = [
            {
                "title": "Premium 2BHK Airbnb Noida | Party | Relax & Chill",
                "description": "Introducing a charming 2 BHK property located in the heart of Noida. This well-designed residence offers a perfect blend of comfort and functionality. High-speed optical fiber internet, 4K smart TV, modern kitchen, and 24/7 building staff.",
                "property_type": "Flat",
                "price_per_night": 4250.0,
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "location": "Noida, Uttar Pradesh, India",
                "host_id": created_users["host@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Kitchen", "Air conditioning", "Free parking on premises", "TV", "Dedicated workspace", "Balcony / Patio", "Smoke alarm"],
            },
            {
                "title": "Luxury Sea-Facing Villa with Private Infinity Pool",
                "description": "Perched on the cliffside of Candolim, this ultra-luxurious 4-bedroom Portuguese-modern villa offers panoramic Arabian Sea sunsets, a private heated infinity pool, and dedicated butler service.",
                "property_type": "Villa",
                "price_per_night": 12500.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 4,
                "bathrooms": 4,
                "location": "Candolim, Goa, India",
                "host_id": created_users["host@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Kitchen", "Air conditioning", "Private pool", "Free parking on premises", "TV", "Coffee maker", "Balcony / Patio"],
            },
            {
                "title": "Cozy Himalayan Cedar Wood Cottage & Mountain View",
                "description": "Handcrafted stone and cedar wood chalet overlooking snow-capped Pir Panjal peaks. Enjoy a warm fireplace, apple orchards outside your window, and hot Himalayan herbal tea on the sun deck.",
                "property_type": "Cottage",
                "price_per_night": 3800.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "location": "Old Manali, Himachal Pradesh, India",
                "host_id": created_users["host2@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Kitchen", "Dedicated workspace", "Free parking on premises", "Balcony / Patio", "Coffee maker", "First aid kit"],
            },
            {
                "title": "Modern High-Rise Apartment overlooking Marine Drive",
                "description": "Stylishly decorated 26th-floor apartment in South Mumbai with floor-to-ceiling windows showing the Queen's Necklace. Walking distance to iconic cafes, art galleries, and restaurants.",
                "property_type": "Apartment",
                "price_per_night": 8900.0,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1,
                "location": "Marine Drive, Mumbai, Maharashtra, India",
                "host_id": created_users["host2@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Kitchen", "Air conditioning", "TV", "Washing machine", "Dedicated workspace", "Refrigerator"],
            },
            {
                "title": "Heritage Haveli Palace with Royal Courtyard & Pool",
                "description": "Step into royal Rajputana architecture with jharokhas, hand-painted frescoes, and a central marble courtyard with a turquoise plunge pool. Includes traditional Rajasthani breakfast.",
                "property_type": "Haveli",
                "price_per_night": 7200.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3,
                "location": "Old City, Jaipur, Rajasthan, India",
                "host_id": created_users["host3@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Private pool", "Air conditioning", "Free parking on premises", "TV", "Coffee maker", "Balcony / Patio"],
            },
            {
                "title": "Charming Parisian Style Studio in Hauz Khas Village",
                "description": "Boho chic studio with a private terrace overlooking the 13th-century Hauz Khas lake and monuments. Filled with natural daylight, indoor plants, record player, and curated books.",
                "property_type": "Studio",
                "price_per_night": 2900.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1,
                "location": "Hauz Khas Village, New Delhi, India",
                "host_id": created_users["host@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Kitchen", "Air conditioning", "Dedicated workspace", "Balcony / Patio", "Coffee maker"],
            },
            {
                "title": "Glass Treehouse Retreat in Rainforest Plantation",
                "description": "Suspended 40 feet above the coffee and spice canopy in Wayanad. Wake up to misty clouds, chirping hornbills, and 360-degree glass views of the Western Ghats.",
                "property_type": "Treehouse",
                "price_per_night": 6400.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1,
                "location": "Wayanad, Kerala, India",
                "host_id": created_users["host3@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=1200&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Free parking on premises", "Balcony / Patio", "Coffee maker", "First aid kit"],
            },
            {
                "title": "Beachfront Sunset Wooden Shack with Direct Sand Access",
                "description": "Rustic, breezy wooden beach cabin situated right on Kudle Beach. Step off your porch directly onto golden sands and fall asleep to the gentle sound of ocean waves.",
                "property_type": "Cabin",
                "price_per_night": 3200.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 1,
                "location": "Kudle Beach, Gokarna, Karnataka, India",
                "host_id": created_users["host2@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Free parking on premises", "Balcony / Patio", "First aid kit"],
            },
            {
                "title": "Contemporary Glass Penthouse with Private Jacuzzi",
                "description": "Designer duplex penthouse in Indiranagar. Features Italian marble flooring, sonos sound system, private rooftop jacuzzi deck with city skyline views, and secure underground parking.",
                "property_type": "Penthouse",
                "price_per_night": 9500.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "location": "Indiranagar, Bengaluru, Karnataka, India",
                "host_id": created_users["host@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=1200&q=80",
                    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Kitchen", "Air conditioning", "Private pool", "Free parking on premises", "TV", "Dedicated workspace", "Washing machine"],
            },
            {
                "title": "Riverside Glamping Geodesic Dome with Stargazing Roof",
                "description": "Geodesic dome placed right alongside the tranquil Ganga river in Shivpuri. Fully insulated with plush bedding, private attached washroom, bonfire pit, and clear sky roof for night stargazing.",
                "property_type": "Dome",
                "price_per_night": 4500.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1,
                "location": "Shivpuri, Rishikesh, Uttarakhand, India",
                "host_id": created_users["host3@airclone.com"].id,
                "photos": [
                    "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&q=80",
                    "https://images.unsplash.com/photo-1533873984035-25970ab07461?w=1200&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
                ],
                "amenities": ["Wifi", "Free parking on premises", "Balcony / Patio", "First aid kit"],
            },
        ]

        created_listings = []
        for l_data in listings_data:
            photos_list = l_data.pop("photos")
            amenities_list = l_data.pop("amenities")

            listing_obj = Listing(**l_data)
            db.add(listing_obj)
            db.commit()
            db.refresh(listing_obj)
            created_listings.append(listing_obj)

            # Add Photos
            for idx, photo_url in enumerate(photos_list):
                photo_obj = ListingPhoto(
                    listing_id=listing_obj.id,
                    image_url=photo_url,
                    display_order=idx,
                )
                db.add(photo_obj)

            # Add Amenities
            for am_name in amenities_list:
                if am_name in amenity_map:
                    link_obj = ListingAmenity(
                        listing_id=listing_obj.id,
                        amenity_id=amenity_map[am_name],
                    )
                    db.add(link_obj)

            db.commit()

        print(f"[+] Created {len(created_listings)} listings with photos and amenities.")

        # =========================================================================
        # 4. SEED SAMPLE BOOKINGS (Confirmed & Active)
        # =========================================================================
        print("[+] Creating Sample Confirmed Bookings...")

        guest1_id = created_users["guest@airclone.com"].id
        guest2_id = created_users["guest2@airclone.com"].id

        sample_bookings = [
            {
                "guest_id": guest1_id,
                "listing_id": created_listings[0].id,  # Noida
                "check_in": date(2026, 8, 28),
                "check_out": date(2026, 8, 30),
                "guests": 2,
                "total_price": 9520.0,
                "status": "confirmed",
            },
            {
                "guest_id": guest1_id,
                "listing_id": created_listings[1].id,  # Goa
                "check_in": date(2026, 9, 15),
                "check_out": date(2026, 9, 18),
                "guests": 4,
                "total_price": 42000.0,
                "status": "confirmed",
            },
            {
                "guest_id": guest2_id,
                "listing_id": created_listings[2].id,  # Manali
                "check_in": date(2026, 7, 10),
                "check_out": date(2026, 7, 14),
                "guests": 2,
                "total_price": 17024.0,
                "status": "completed",
            },
            {
                "guest_id": guest2_id,
                "listing_id": created_listings[4].id,  # Jaipur
                "check_in": date(2026, 10, 1),
                "check_out": date(2026, 10, 5),
                "guests": 3,
                "total_price": 32256.0,
                "status": "confirmed",
            },
        ]

        for b in sample_bookings:
            b_obj = Booking(**b)
            db.add(b_obj)

        db.commit()
        print(f"[+] Created {len(sample_bookings)} sample bookings.")

        # =========================================================================
        # 5. SEED VERIFIED GUEST REVIEWS
        # =========================================================================
        print("[+] Creating Sample Verified Guest Reviews...")

        sample_reviews = [
            {
                "guest_id": guest1_id,
                "listing_id": created_listings[0].id,
                "rating": 5,
                "comment": "Had an amazing stay at Vaibhav's place in Noida! The apartment was sparkling clean, decor was stunning, and the high-speed wifi made remote working seamless. 10/10 recommend!",
            },
            {
                "guest_id": guest2_id,
                "listing_id": created_listings[0].id,
                "rating": 5,
                "comment": "Super cozy place with great natural lighting and lovely balcony views. Self check-in was completely hassle-free.",
            },
            {
                "guest_id": guest1_id,
                "listing_id": created_listings[1].id,
                "rating": 5,
                "comment": "The private pool and sunset views in Goa were out of this world. Felt like a celebrity paradise. Host was attentive and quick to respond.",
            },
            {
                "guest_id": guest2_id,
                "listing_id": created_listings[2].id,
                "rating": 5,
                "comment": "Magical mountain cottage surrounded by pine trees. Waking up to the view of snow peaks with hot coffee was the highlight of our trip.",
            },
            {
                "guest_id": guest1_id,
                "listing_id": created_listings[3].id,
                "rating": 4,
                "comment": "Spectacular Marine Drive view from the 26th floor! Very comfortable bed and pristine bathroom.",
            },
        ]

        for r in sample_reviews:
            r_obj = Review(**r)
            db.add(r_obj)

        db.commit()
        print(f"[+] Created {len(sample_reviews)} guest reviews.")

        print("\n[SUCCESS] AirClone Database Successfully Seeded!")
        print("==================================================")
        print("Test Credentials:")
        print("  Superhost:  host@airclone.com    / password123")
        print("  Host 2:     host2@airclone.com   / password123")
        print("  Host 3:     host3@airclone.com   / password123")
        print("  Guest 1:    guest@airclone.com   / password123")
        print("  Guest 2:    guest2@airclone.com  / password123")
        print("==================================================")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error while seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

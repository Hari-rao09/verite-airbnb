"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import SplitMapView, { SplitStay } from "@/components/home/split-map-view";

const noidaStays: SplitStay[] = [
  {
    id: "1",
    title: "Flat in Noida",
    headline: "Premium 2BHK Airbnb Noida | Party | Relax & Chill",
    propertyType: "Flat",
    location: "Noida",
    country: "India",
    guests: 5,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 4250,
    originalPrice: 8500,
    rating: 4.76,
    reviewCount: 17,
    dates: "28–30 Aug",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
    ],
    lat: 28.5355,
    lng: 77.391,
    isGuestFavorite: true,
    isPinned: true,
  },
  {
    id: "2",
    title: "Flat in Noida",
    propertyType: "Flat",
    location: "Noida",
    country: "India",
    guests: 4,
    bedrooms: 2,
    price: 2500,
    rating: 4.2,
    reviewCount: 5,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
    lat: 28.567,
    lng: 77.321,
  },
  {
    id: "3",
    title: "Loft in Noida",
    propertyType: "Loft",
    location: "Noida",
    country: "India",
    guests: 3,
    bedrooms: 1,
    price: 3000,
    rating: 4.8,
    reviewCount: 5,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    lat: 28.582,
    lng: 77.335,
  },
  {
    id: "4",
    title: "Modern Apartment in Noida",
    propertyType: "Apartment",
    location: "Noida",
    country: "India",
    guests: 4,
    bedrooms: 2,
    price: 5532,
    rating: 4.9,
    reviewCount: 14,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    lat: 28.541,
    lng: 77.402,
  },
  {
    id: "5",
    title: "Luxury Villa in Greater Noida",
    propertyType: "Villa",
    location: "Noida",
    country: "India",
    guests: 8,
    bedrooms: 4,
    price: 13170,
    rating: 4.95,
    reviewCount: 22,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    lat: 28.474,
    lng: 77.503,
  },
  {
    id: "6",
    title: "Penthouse Suite Noida",
    propertyType: "Penthouse",
    location: "Noida",
    country: "India",
    guests: 6,
    bedrooms: 3,
    price: 10168,
    rating: 4.88,
    reviewCount: 9,
    image:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    lat: 28.512,
    lng: 77.378,
  },
  {
    id: "7",
    title: "Executive Flat Sector 62",
    propertyType: "Flat",
    location: "Noida",
    country: "India",
    guests: 4,
    bedrooms: 2,
    price: 7500,
    rating: 4.82,
    reviewCount: 11,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    lat: 28.625,
    lng: 77.368,
  },
  {
    id: "8",
    title: "Grand Residency Indirapuram",
    propertyType: "Apartment",
    location: "Noida",
    country: "India",
    guests: 5,
    bedrooms: 3,
    price: 11709,
    rating: 4.91,
    reviewCount: 18,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    lat: 28.641,
    lng: 77.382,
  },
];

export default function SearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const rawLocation = String(params.location || "Noida");
  const decodedLocation = decodeURIComponent(rawLocation);

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 transition-colors duration-200">
      <Header />

      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 pt-[210px] pb-24">
        <SplitMapView
          locationName={decodedLocation}
          stays={noidaStays}
          onBackToGrid={() => router.push("/")}
        />
      </div>
    </main>
  );
}

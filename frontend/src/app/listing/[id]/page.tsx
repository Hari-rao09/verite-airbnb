"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { propertiesApi } from "@/lib/api/properties";
import { favoritesApi } from "@/lib/api/favorites";

interface Photo {
  id: number;
  listing_id: number;
  image_url: string;
  display_order: number;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  property_type: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  location: string;
  host_id: number;
  is_active: number;
  photos?: Photo[];
}

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await propertiesApi.getById(
          String(params.id)
        );

        setListing(data);

        // Check wishlist status
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const wishlist = await favoritesApi.getAll();

            const alreadyLiked = wishlist.some(
              (item: any) =>
                String(item.listing_id) ===
                String(params.id)
            );

            setLiked(alreadyLiked);
          } catch (error) {
            console.error(
              "Failed to load wishlist:",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch listing:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const toggleLike = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to save properties.");
      return;
    }

    if (favoriteLoading) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (liked) {
        await favoritesApi.remove(String(listing?.id));

        setLiked(false);
      } else {
        await favoritesApi.add(String(listing?.id));

        setLiked(true);
      }
    } catch (error: any) {
      console.error(
        "Failed to update wishlist:",
        error
      );

      if (error?.response?.status === 401) {
        alert("Please log in again.");
      } else {
        alert(
          "Failed to update wishlist. Please try again."
        );
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const nextImage = () => {
    if (!listing?.photos?.length) {
      return;
    }

    if (
      currentImage <
      listing.photos.length - 1
    ) {
      setCurrentImage(currentImage + 1);
    }
  };

  const previousImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading listing...
        </p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">
          Listing not found
        </h1>

        <button
          onClick={() => router.back()}
          className="px-5 py-2 rounded-lg bg-black text-white"
        >
          Go Back
        </button>
      </main>
    );
  }

  const photos = listing.photos || [];

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-medium hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={toggleLike}
            disabled={favoriteLoading}
            className="flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <Heart
              className={`w-6 h-6 ${
                liked
                  ? "fill-[#FF385C] text-[#FF385C]"
                  : "text-gray-700"
              }`}
            />

            <span>
              {liked ? "Saved" : "Save"}
            </span>
          </button>

        </div>
      </header>

      {/* LISTING */}
      <section className="max-w-6xl mx-auto px-6 py-8">

        {/* TITLE */}
        <div className="mb-6">

          <h1 className="text-3xl font-semibold">
            {listing.title}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-gray-600">

            <Star className="w-4 h-4 fill-black text-black" />

            <span>5.0</span>

            <span>·</span>

            <span>
              {listing.location}
            </span>

          </div>

        </div>

        {/* IMAGES */}
        <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-gray-200 mb-8">

          {photos.length > 0 ? (
            <>
              <img
                src={photos[currentImage].image_url}
                alt={`${listing.title} ${
                  currentImage + 1
                }`}
                className="w-full h-full object-cover"
              />

              {/* PREVIOUS */}
              {currentImage > 0 && (
                <button
                  onClick={previousImage}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    w-10
                    h-10
                    rounded-full
                    bg-white/90
                    flex
                    items-center
                    justify-center
                    shadow-md
                    hover:bg-white
                    hover:scale-105
                    transition
                  "
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* NEXT */}
              {currentImage <
                photos.length - 1 && (
                <button
                  onClick={nextImage}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    w-10
                    h-10
                    rounded-full
                    bg-white/90
                    flex
                    items-center
                    justify-center
                    shadow-md
                    hover:bg-white
                    hover:scale-105
                    transition
                  "
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* IMAGE COUNTER */}
              {photos.length > 1 && (
                <div className="
                  absolute
                  bottom-4
                  right-4
                  bg-black/70
                  text-white
                  px-3
                  py-1.5
                  rounded-full
                  text-sm
                ">
                  {currentImage + 1} /{" "}
                  {photos.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">

                <div className="text-6xl mb-4">
                  🏠
                </div>

                <p className="text-gray-500">
                  No photos available
                </p>

              </div>
            </div>
          )}

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2">

            <h2 className="text-2xl font-semibold mb-3">
              {listing.property_type} in{" "}
              {listing.location}
            </h2>

            <p className="text-gray-600 mb-6">
              Up to {listing.max_guests} guests ·{" "}
              {listing.bedrooms} bedrooms ·{" "}
              {listing.beds} beds ·{" "}
              {listing.bathrooms} bathrooms
            </p>

            <hr className="mb-6" />

            <h2 className="text-xl font-semibold mb-3">
              About this place
            </h2>

            <p className="text-gray-700 leading-7">
              {listing.description}
            </p>

          </div>

          {/* BOOKING CARD */}
          <div className="border rounded-2xl p-6 shadow-lg h-fit">

            <div className="flex items-center justify-between mb-6">

              <div>

                <span className="text-2xl font-semibold">
                  ₹
                  {listing.price_per_night.toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span className="text-gray-500">
                  {" "}night
                </span>

              </div>

              <div className="flex items-center gap-1">

                <Star className="w-4 h-4 fill-black" />

                <span>5.0</span>

              </div>

            </div>

            <div className="border rounded-xl overflow-hidden mb-4">

              <div className="p-4">

                <p className="text-xs font-semibold">
                  GUESTS
                </p>

                <p className="text-gray-600">
                  {listing.max_guests} guests
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                router.push(
                  `/booking/${listing.id}`
                )
              }
              className="
                w-full
                bg-[#FF385C]
                text-white
                font-semibold
                py-3
                rounded-lg
                hover:bg-[#e31c5a]
                transition
              "
            >
              Reserve
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              You won't be charged yet
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}
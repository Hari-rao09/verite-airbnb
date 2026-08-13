"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

import type { Property } from "@/types";
import { favoritesApi } from "@/lib/api/favorites";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Check if this property is already in the user's wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const wishlist = await favoritesApi.getAll();

        const alreadyLiked = wishlist.some(
  (item) => String(item.listing_id) === String(property.id)
);

        setIsLiked(alreadyLiked);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    checkWishlist();
  }, [property.id]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

      if (isLiked) {
        // Remove from wishlist
        await favoritesApi.remove(String(property.id));

        setIsLiked(false);
      } else {
        // Add to wishlist
        await favoritesApi.add(String(property.id));

        setIsLiked(true);
      }
    } catch (error: any) {
      console.error("Failed to update wishlist:", error);

      if (error?.response?.status === 401) {
        alert("Please log in again.");
      } else {
        console.error(
          "Wishlist error:",
          error?.response?.data || error
        );

        alert("Failed to update wishlist. Please try again.");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <article
  className="w-full cursor-pointer group"
  onClick={() => router.push(`/listing/${property.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE */}
      <div
        className="relative w-full rounded-xl overflow-hidden mb-3"
        style={{ aspectRatio: "251.14 / 238.58" }}
      >
        <Image
          src={property.images[currentImageIndex] || "/placeholder.jpg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw"
        />

        {/* Guest Favorite */}
        {property.isGuestFavorite && (
          <div className="absolute top-2.5 left-2.5">
            <div className="bg-white rounded-2xl px-2 py-1 shadow-sm">
              <span className="text-xs font-semibold text-secondary">
                Guest favorite
              </span>
            </div>
          </div>
        )}

        {/* FAVORITE BUTTON */}
        <button
          onClick={toggleLike}
          disabled={favoriteLoading}
          className={`absolute top-3 right-3 p-1.5 transition-transform ${
            favoriteLoading
              ? "opacity-50 cursor-wait"
              : "hover:scale-110"
          }`}
          aria-label={
            isLiked
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isLiked
                ? "fill-primary text-primary"
                : "fill-black/50 text-white stroke-2"
            }`}
          />
        </button>

        {/* PREVIOUS / NEXT */}
        {property.images.length > 1 && isHovered && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2
                  w-7 h-7 rounded-full bg-white/90
                  flex items-center justify-center
                  hover:bg-white hover:scale-105
                  transition-all shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-secondary" />
              </button>
            )}

            {currentImageIndex < property.images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2
                  w-7 h-7 rounded-full bg-white/90
                  flex items-center justify-center
                  hover:bg-white hover:scale-105
                  transition-all shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-secondary" />
              </button>
            )}
          </>
        )}

        {/* IMAGE DOTS */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.slice(0, 5).map((_, index) => (
              <span
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white scale-110"
                    : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* PROPERTY INFORMATION */}
      <div className="space-y-0.5">
        {/* TITLE + RATING */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-[15px] text-secondary truncate flex-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />

            <span className="text-sm text-secondary">
              {(property.rating ?? 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* LOCATION */}
        <p className="text-sm text-text-2 truncate">
          {property.city}, {property.country}
        </p>

        {/* PROPERTY TYPE */}
        <p className="text-sm text-text-2 capitalize">
          {property.propertyType.toLowerCase()}
        </p>

        {/* PRICE */}
        <p className="text-[15px] text-secondary pt-1">
          <span className="font-semibold">
            ₹{property.price.toLocaleString("en-IN")}
          </span>

          <span className="font-normal"> night</span>
        </p>
      </div>
    </article>
  );
};

export default PropertyCard;
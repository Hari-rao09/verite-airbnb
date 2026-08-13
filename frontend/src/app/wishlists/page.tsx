"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import { Heart } from "lucide-react";

import { favoritesApi } from "@/lib/api/favorites";
import { propertiesApi } from "@/lib/api/properties";
import type { Property } from "@/types";

interface WishlistItem {
  id: number;
  user_id: number;
  listing_id: number;
}

export default function WishlistsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        // Get user's saved listings
        const wishlist = await favoritesApi.getAll();

        // Get all available properties
        const allProperties = await propertiesApi.getAll();

        // Only keep properties that are in the wishlist
        const savedProperties = allProperties.filter((property) =>
          wishlist.some(
            (item: WishlistItem) =>
              Number(item.listing_id) === Number(property.id)
          )
        );

        setProperties(savedProperties);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-[240px] max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-7 h-7" />
          <h1 className="text-3xl font-semibold">
            Wishlists
          </h1>
        </div>

        {loading ? (
          <div className="text-gray-500">
            Loading your wishlists...
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12">
            <h2 className="text-xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Save places you like by clicking the heart icon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div key={property.id}>
                <div className="relative">
                  <img
                    src={
                      property.images?.[0] ||
                      "/placeholder.jpg"
                    }
                    alt={property.title}
                    className="w-full aspect-square object-cover rounded-xl"
                  />

                  <div className="absolute top-3 right-3">
                    <Heart className="w-6 h-6 fill-[#FF385C] text-[#FF385C]" />
                  </div>
                </div>

                <div className="mt-3">
                  <h2 className="font-medium truncate">
                    {property.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {property.city}, {property.country}
                  </p>

                  <p className="text-sm text-gray-500">
                    {property.propertyType}
                  </p>

                  <p className="mt-1">
                    <span className="font-semibold">
                      ₹{property.price.toLocaleString("en-IN")}
                    </span>{" "}
                    night
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
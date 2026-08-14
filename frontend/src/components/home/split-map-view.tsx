"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  Sparkles,
} from "lucide-react";

const AirbnbMap = dynamic(() => import("@/components/map/airbnb-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl bg-gray-100 dark:bg-[#222222] animate-pulse flex items-center justify-center text-gray-400">
      Loading interactive map...
    </div>
  ),
});

export interface SplitStay {
  id: number | string;
  title: string;
  headline?: string;
  propertyType: string;
  location: string;
  country: string;
  guests: number;
  bedrooms: number;
  beds?: number;
  bathrooms?: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount?: number;
  dates?: string;
  image: string;
  images?: string[];
  lat: number;
  lng: number;
  isGuestFavorite?: boolean;
  isPinned?: boolean;
}

interface SplitMapViewProps {
  locationName: string;
  stays: SplitStay[];
  onBackToGrid?: () => void;
}

export default function SplitMapView({
  locationName = "Noida",
  stays,
  onBackToGrid,
}: SplitMapViewProps) {
  const router = useRouter();
  const [selectedStayId, setSelectedStayId] = useState<number | string | null>(
    stays[0]?.id || "1"
  );
  const [hoveredStayId, setHoveredStayId] = useState<number | string | null>(
    null
  );
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [activePhotoIndexes, setActivePhotoIndexes] = useState<{
    [key: string]: number;
  }>({});

  const toggleFavorite = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNextPhoto = (
    e: React.MouseEvent,
    id: number | string,
    total: number
  ) => {
    e.stopPropagation();
    setActivePhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };

  const handlePrevPhoto = (
    e: React.MouseEvent,
    id: number | string,
    total: number
  ) => {
    e.stopPropagation();
    setActivePhotoIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + total) % total,
    }));
  };

  const pinnedStay = stays.find((s) => s.isPinned) || stays[0];
  const otherStays = stays.filter((s) => s.id !== pinnedStay?.id);

  // Map markers from all stays
  const mapListings = stays.map((s) => ({
    id: s.id,
    title: s.title,
    price: s.price,
    lat: s.lat,
    lng: s.lng,
  }));

  const pinnedImages = pinnedStay?.images || [
    pinnedStay?.image ||
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  ];
  const pinnedPhotoIdx = activePhotoIndexes[pinnedStay?.id] || 0;

  return (
    <div className="w-full">
      {/* TOP FILTERS & STATS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-2">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="text-xs font-bold underline text-gray-500 hover:text-black dark:hover:text-white"
            >
              ← Back to all sections
            </button>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Over 1,000 homes in {locationName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold py-1.5 px-3 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 rounded-full border border-pink-100 dark:border-pink-900/40">
            🏷️ Prices include all fees
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-[#333333] text-xs font-semibold text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white transition">
              <SlidersHorizontal size={13} />
              Filters
            </button>
            <button className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-[#333333] text-xs font-semibold text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white transition">
              Price ▾
            </button>
            <button className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-[#333333] text-xs font-semibold text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white transition">
              Type of place ▾
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SPLIT VIEW CONTAINER: LISTINGS (LEFT) + INTERACTIVE MAP (RIGHT)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_560px] gap-8">
        {/* ======================= LEFT COLUMN: LISTINGS ======================= */}
        <div className="space-y-6">
          {/* PINNED / FEATURED LARGE HORIZONTAL CARD (IMAGE 1) */}
          {pinnedStay && (
            <div
              onClick={() => router.push(`/listing/${pinnedStay.id}`)}
              onMouseEnter={() => {
                setSelectedStayId(pinnedStay.id);
                setHoveredStayId(pinnedStay.id);
              }}
              className={`border border-gray-200 dark:border-[#2a2a2a] rounded-3xl p-4 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col md:flex-row gap-6 group ${
                selectedStayId === pinnedStay.id
                  ? "ring-2 ring-black dark:ring-white"
                  : ""
              }`}
            >
              {/* IMAGE CAROUSEL CONTAINER */}
              <div className="relative w-full md:w-[320px] aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#222222] shrink-0">
                <img
                  src={pinnedImages[pinnedPhotoIdx]}
                  alt={pinnedStay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* GUEST FAVOURITE BADGE */}
                {pinnedStay.isGuestFavorite && (
                  <div className="absolute left-3 top-3 bg-white/95 dark:bg-[#1e1e1e]/95 text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-gray-100 dark:border-[#333333]">
                    🏆 Guest favourite
                  </div>
                )}

                {/* HEART BUTTON */}
                <button
                  onClick={(e) => toggleFavorite(e, pinnedStay.id)}
                  className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center"
                >
                  <Heart
                    size={22}
                    className={`${
                      favorites.includes(pinnedStay.id)
                        ? "fill-[#FF385C] text-[#FF385C]"
                        : "text-white"
                    } drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]`}
                  />
                </button>

                {/* CAROUSEL ARROWS ON HOVER */}
                {pinnedImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) =>
                        handlePrevPhoto(e, pinnedStay.id, pinnedImages.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-[#1e1e1e]/80 text-gray-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) =>
                        handleNextPhoto(e, pinnedStay.id, pinnedImages.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-[#1e1e1e]/80 text-gray-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* CAROUSEL DOTS */}
                {pinnedImages.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {pinnedImages.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          pinnedPhotoIdx === i
                            ? "w-4 bg-white"
                            : "w-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* CARD DETAILS */}
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {pinnedStay.propertyType} in {pinnedStay.location}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 line-clamp-2">
                    {pinnedStay.headline || pinnedStay.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {pinnedStay.bedrooms} bedrooms · {pinnedStay.beds || 2}{" "}
                    beds · {pinnedStay.bathrooms || 2} private bathrooms
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {pinnedStay.dates || "28–30 Aug"}
                  </p>
                </div>

                <div className="flex items-end justify-between mt-4 pt-3 border-t border-gray-100 dark:border-[#2a2a2a]">
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                    <Star
                      size={14}
                      className="fill-black dark:fill-white text-black dark:text-white"
                    />
                    <span>{pinnedStay.rating.toFixed(2)}</span>
                    <span className="text-gray-400 font-normal text-xs">
                      ({pinnedStay.reviewCount || 17})
                    </span>
                  </div>

                  <div className="text-right">
                    {pinnedStay.originalPrice && (
                      <span className="text-xs text-gray-400 line-through mr-1.5">
                        ₹
                        {(pinnedStay.originalPrice * 2).toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      ₹{(pinnedStay.price * 2).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {" "}
                      for 2 nights
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY LISTINGS GRID (IMAGE 1 BOTTOM ROW) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {otherStays.map((stay) => {
              const isFav = favorites.includes(stay.id);
              return (
                <div
                  key={stay.id}
                  onClick={() => router.push(`/listing/${stay.id}`)}
                  onMouseEnter={() => {
                    setSelectedStayId(stay.id);
                    setHoveredStayId(stay.id);
                  }}
                  className={`border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-3 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-lg transition cursor-pointer group ${
                    selectedStayId === stay.id
                      ? "ring-2 ring-black dark:ring-white"
                      : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-[#222222] mb-3">
                    <img
                      src={stay.image}
                      alt={stay.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <button
                      onClick={(e) => toggleFavorite(e, stay.id)}
                      className="absolute right-2.5 top-2.5 w-7 h-7 flex items-center justify-center"
                    >
                      <Heart
                        size={20}
                        className={`${
                          isFav
                            ? "fill-[#FF385C] text-[#FF385C]"
                            : "text-white"
                        } drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {stay.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {stay.location}, {stay.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold shrink-0">
                      <Star
                        size={12}
                        className="fill-black dark:fill-white text-black dark:text-white"
                      />
                      <span>{stay.rating.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">
                        ({stay.reviewCount || 5})
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                    ₹{stay.price.toLocaleString("en-IN")}{" "}
                    <span className="font-normal text-xs text-gray-500 dark:text-gray-400">
                      night
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================= RIGHT COLUMN: INTERACTIVE MAP ======================= */}
        <div className="sticky top-28 h-[calc(100vh-140px)] min-h-[500px]">
          <AirbnbMap
            listings={mapListings}
            selectedListingId={selectedStayId}
            onSelectListing={(id) => {
              setSelectedStayId(id);
              router.push(`/listing/${id}`);
            }}
            center={[pinnedStay?.lat || 28.5355, pinnedStay?.lng || 77.391]}
            zoom={12}
            className="w-full h-full rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}

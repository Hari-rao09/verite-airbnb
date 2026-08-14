"use client";

import { useState, useMemo } from "react";
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
  Tag,
  Award,
  RotateCcw,
} from "lucide-react";
import FilterModal, { FilterState, initialFilterState } from "@/components/home/filter-modal";

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
  const [hoveredStayId, setHoveredStayId] = useState<number | string | null>(null);
  const [favorites, setFavorites] = useState<(number | string)[]>([]);
  const [activePhotoIndexes, setActivePhotoIndexes] = useState<{
    [key: string]: number;
  }>({});

  // Interactive Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

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

  // Filter Stays Dynamically
  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      // 1. Price
      if (stay.price < filters.minPrice || stay.price > filters.maxPrice) {
        return false;
      }
      // 2. Place Type
      if (filters.placeType === "ENTIRE") {
        const typeLower = stay.propertyType?.toLowerCase() || "";
        if (typeLower.includes("room") || typeLower.includes("shared")) return false;
      } else if (filters.placeType === "ROOM") {
        const typeLower = stay.propertyType?.toLowerCase() || "";
        if (!typeLower.includes("room") && !typeLower.includes("studio")) return false;
      }
      // 3. Property Types
      if (filters.propertyTypes.length > 0) {
        const matchType = filters.propertyTypes.some((t) =>
          stay.propertyType?.toLowerCase().includes(t.toLowerCase()) ||
          stay.title?.toLowerCase().includes(t.toLowerCase())
        );
        if (!matchType) return false;
      }
      // 4. Bedrooms
      if (filters.bedrooms > 0 && stay.bedrooms < filters.bedrooms) {
        return false;
      }
      // 5. Beds
      if (filters.beds > 0 && (stay.beds || stay.bedrooms || 1) < filters.beds) {
        return false;
      }
      // 6. Bathrooms
      if (filters.bathrooms > 0 && (stay.bathrooms || 1) < filters.bathrooms) {
        return false;
      }
      return true;
    });
  }, [stays, filters]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice > 1000 || filters.maxPrice < 50000) count++;
    if (filters.placeType !== "ANY") count++;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.bedrooms > 0) count++;
    if (filters.beds > 0) count++;
    if (filters.bathrooms > 0) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.instantBook) count++;
    if (filters.selfCheckIn) count++;
    return count;
  }, [filters]);

  const pinnedStay = filteredStays.find((s) => s.isPinned) || filteredStays[0];
  const otherStays = filteredStays.filter((s) => s.id !== pinnedStay?.id);

  // Map markers from filtered stays
  const mapListings = filteredStays.map((s) => ({
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
            {filteredStays.length} home{filteredStays.length !== 1 ? "s" : ""} in {locationName}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 rounded-full border border-pink-100 dark:border-pink-900/40">
            <Tag size={13} className="text-pink-600 dark:text-pink-400" />
            Prices include all fees
          </div>

          <div className="flex items-center gap-2">
            {/* FILTERS BUTTON WITH ACTIVE COUNT BADGE */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition shadow-sm ${
                activeFilterCount > 0
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white ring-2 ring-black/10"
                  : "border-gray-300 dark:border-[#333333] text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white bg-white dark:bg-[#1e1e1e]"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* QUICK PRICE FILTER PILL */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full border border-gray-300 dark:border-[#333333] text-xs font-semibold text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white bg-white dark:bg-[#1e1e1e] transition"
            >
              {filters.minPrice > 1000 || filters.maxPrice < 50000
                ? `₹${filters.minPrice.toLocaleString()}–₹${filters.maxPrice.toLocaleString()}`
                : "Price ▾"}
            </button>

            {/* QUICK TYPE OF PLACE PILL */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full border border-gray-300 dark:border-[#333333] text-xs font-semibold text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white bg-white dark:bg-[#1e1e1e] transition"
            >
              {filters.placeType === "ENTIRE"
                ? "Entire place"
                : filters.placeType === "ROOM"
                ? "Room"
                : "Type of place ▾"}
            </button>

            {/* RESET FILTERS BUTTON */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters(initialFilterState)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-gray-500 hover:text-black dark:hover:text-white transition"
                title="Reset filters"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NO MATCHING RESULTS STATE */}
      {filteredStays.length === 0 ? (
        <div className="border border-dashed border-gray-300 dark:border-[#383838] rounded-3xl p-12 text-center bg-gray-50/50 dark:bg-[#181818]/50 space-y-4 my-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <SlidersHorizontal size={26} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No exact matches found in {locationName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your price range, property types, or bedroom filters to see more available stays.
          </p>
          <button
            type="button"
            onClick={() => setFilters(initialFilterState)}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold transition shadow-md"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* =========================================================================
            SPLIT VIEW CONTAINER: LISTINGS (LEFT) + INTERACTIVE MAP (RIGHT)
        ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_560px] gap-8">
          {/* ======================= LEFT COLUMN: LISTINGS ======================= */}
          <div className="space-y-6">
            {/* PINNED / FEATURED LARGE HORIZONTAL CARD */}
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
                    <div className="absolute left-3 top-3 bg-white/95 dark:bg-[#1e1e1e]/95 text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 border border-gray-100 dark:border-[#333333]">
                      <Award size={13} className="text-amber-500" />
                      Guest favourite
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

            {/* SECONDARY LISTINGS GRID */}
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
      )}

      {/* FILTER MODAL COMPONENT */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        currentFilters={filters}
        matchingListingsCount={filteredStays.length}
      />
    </div>
  );
}

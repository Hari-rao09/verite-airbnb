"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Wifi,
  Wind,
  Utensils,
  Car,
  Tv,
  Waves,
  Laptop,
  Sun,
  ShieldCheck,
  HeartPulse,
  Coffee,
  Snowflake,
  Home,
  Building2,
  Building,
  Palmtree,
  Tent,
  Castle,
  Trees,
  Sparkles,
  Check,
} from "lucide-react";

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  placeType: "ANY" | "ENTIRE" | "ROOM" | "SHARED";
  propertyTypes: string[];
  bedrooms: number; // 0 = Any
  beds: number; // 0 = Any
  bathrooms: number; // 0 = Any
  amenities: string[];
  instantBook: boolean;
  selfCheckIn: boolean;
}

export const initialFilterState: FilterState = {
  minPrice: 1000,
  maxPrice: 50000,
  placeType: "ANY",
  propertyTypes: [],
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  amenities: [],
  instantBook: false,
  selfCheckIn: false,
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters?: FilterState;
  totalListingsCount?: number;
  matchingListingsCount?: number;
}

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters = initialFilterState,
  matchingListingsCount,
}: FilterModalProps) {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, currentFilters]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const propertyTypeOptions = [
    { label: "House", icon: Home },
    { label: "Flat", icon: Building2 },
    { label: "Villa", icon: Palmtree },
    { label: "Cottage", icon: Tent },
    { label: "Haveli", icon: Castle },
    { label: "Studio", icon: Building },
    { label: "Treehouse", icon: Trees },
    { label: "Cabin", icon: Tent },
    { label: "Penthouse", icon: Sparkles },
  ];

  const amenityOptions = [
    { label: "Wifi", icon: Wifi, category: "Essentials" },
    { label: "Kitchen", icon: Utensils, category: "Essentials" },
    { label: "Air conditioning", icon: Wind, category: "Essentials" },
    { label: "Dedicated workspace", icon: Laptop, category: "Essentials" },
    { label: "TV", icon: Tv, category: "Essentials" },
    { label: "Washing machine", icon: Sparkles, category: "Essentials" },
    { label: "Private pool", icon: Waves, category: "Features" },
    { label: "Free parking on premises", icon: Car, category: "Features" },
    { label: "Balcony / Patio", icon: Sun, category: "Features" },
    { label: "Coffee maker", icon: Coffee, category: "Features" },
    { label: "Refrigerator", icon: Snowflake, category: "Features" },
    { label: "Smoke alarm", icon: ShieldCheck, category: "Safety" },
    { label: "First aid kit", icon: HeartPulse, category: "Safety" },
  ];

  const togglePropertyType = (type: string) => {
    setFilters((prev) => {
      const exists = prev.propertyTypes.includes(type);
      return {
        ...prev,
        propertyTypes: exists
          ? prev.propertyTypes.filter((t) => t !== type)
          : [...prev.propertyTypes, type],
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleClearAll = () => {
    setFilters(initialFilterState);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const numberPills = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-[780px] h-[100dvh] sm:h-auto sm:max-h-[85vh] bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-[#333] animate-in zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            MODAL HEADER
        ========================================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#2a2a2a] shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Filters</h2>
          <div className="w-9" />
        </div>

        {/* =========================================================================
            MODAL SCROLLABLE BODY
        ========================================================================= */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 divide-y divide-gray-100 dark:divide-[#2a2a2a]">
          {/* 1. TYPE OF PLACE */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Type of place</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Search rooms, entire homes, or any type of place.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "ANY", label: "Any type", desc: "Browse everything" },
                { key: "ENTIRE", label: "Entire place", desc: "A place to yourself" },
                { key: "ROOM", label: "Room", desc: "Private room + shared" },
                { key: "SHARED", label: "Shared room", desc: "Shared sleeping space" },
              ].map((item) => {
                const isSelected = filters.placeType === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        placeType: item.key as any,
                      }))
                    }
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? "border-black dark:border-white bg-gray-50 dark:bg-[#282828] ring-1 ring-black dark:ring-white"
                        : "border-gray-200 dark:border-[#333] hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-[#181818]"
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. PRICE RANGE SLIDER & INPUTS */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Price range</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Nightly prices before taxes and all fees
                </p>
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 rounded-full border border-pink-100 dark:border-pink-900/40">
                Avg: ₹6,850/night
              </div>
            </div>

            {/* Price Histogram Bars Simulation */}
            <div className="h-16 flex items-end gap-1 px-2 pt-2">
              {[12, 24, 45, 60, 85, 100, 75, 90, 65, 50, 40, 30, 20, 15, 10, 8, 5, 3].map(
                (height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className="flex-1 bg-gray-200 dark:bg-[#333] rounded-t-sm hover:bg-[#FF385C] transition-colors"
                  />
                )
              )}
            </div>

            {/* Min / Max Range Inputs */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="p-3 rounded-2xl border border-gray-300 dark:border-[#383838] bg-gray-50 dark:bg-[#181818]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Minimum
                </label>
                <div className="flex items-center gap-1 font-bold text-sm mt-0.5">
                  <span>₹</span>
                  <input
                    type="number"
                    min={500}
                    max={filters.maxPrice - 500}
                    step={500}
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-transparent outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-gray-300 dark:border-[#383838] bg-gray-50 dark:bg-[#181818]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Maximum
                </label>
                <div className="flex items-center gap-1 font-bold text-sm mt-0.5">
                  <span>₹</span>
                  <input
                    type="number"
                    min={filters.minPrice + 500}
                    max={100000}
                    step={500}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: Number(e.target.value) || 50000,
                      }))
                    }
                    className="w-full bg-transparent outline-none font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ROOMS AND BEDS */}
          <div className="pt-8 space-y-5">
            <h3 className="text-lg font-bold">Rooms and beds</h3>

            {/* Bedrooms */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Bedrooms
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {numberPills.map((num) => {
                  const isSelected = filters.bedrooms === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, bedrooms: num }))
                      }
                      className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition ${
                        isSelected
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                          : "border border-gray-300 dark:border-[#383838] hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {num === 0 ? "Any" : num === 8 ? "8+" : String(num)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Beds */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Beds
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {numberPills.map((num) => {
                  const isSelected = filters.beds === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, beds: num }))
                      }
                      className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition ${
                        isSelected
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                          : "border border-gray-300 dark:border-[#383838] hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {num === 0 ? "Any" : num === 8 ? "8+" : String(num)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Bathrooms
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {numberPills.map((num) => {
                  const isSelected = filters.bathrooms === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, bathrooms: num }))
                      }
                      className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition ${
                        isSelected
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                          : "border border-gray-300 dark:border-[#383838] hover:border-black dark:hover:border-white text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {num === 0 ? "Any" : num === 8 ? "8+" : String(num)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. PROPERTY TYPE */}
          <div className="pt-8 space-y-4">
            <h3 className="text-lg font-bold">Property type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {propertyTypeOptions.map((item) => {
                const IconComponent = item.icon;
                const isSelected = filters.propertyTypes.includes(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => togglePropertyType(item.label)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "border-black dark:border-white bg-gray-50 dark:bg-[#282828] ring-1 ring-black dark:ring-white"
                        : "border-gray-200 dark:border-[#333] hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-[#181818]"
                    }`}
                  >
                    <IconComponent size={22} className="text-gray-700 dark:text-gray-300" />
                    <span className="font-bold text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. AMENITIES CHECKLIST */}
          <div className="pt-8 space-y-4">
            <h3 className="text-lg font-bold">Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {amenityOptions.map((amenity) => {
                const Icon = amenity.icon;
                const isChecked = filters.amenities.includes(amenity.label);
                return (
                  <label
                    key={amenity.label}
                    onClick={() => toggleAmenity(amenity.label)}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#252525] cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {amenity.label}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        isChecked
                          ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-[#181818]"
                      }`}
                    >
                      {isChecked && <Check size={13} strokeWidth={3} />}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 6. BOOKING OPTIONS */}
          <div className="pt-8 space-y-4">
            <h3 className="text-lg font-bold">Booking options</h3>
            <div className="space-y-4">
              {/* Instant Book */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    Instant Book
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Listings you can book without waiting for host approval
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      instantBook: !prev.instantBook,
                    }))
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    filters.instantBook
                      ? "bg-black dark:bg-white"
                      : "bg-gray-200 dark:bg-[#383838]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white dark:bg-[#181818] shadow-md transition-transform ${
                      filters.instantBook
                        ? "translate-x-5"
                        : "translate-x-0 bg-white"
                    }`}
                  />
                </button>
              </div>

              {/* Self Check-in */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    Self check-in
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Easy access to the property with smart lock or key safe
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selfCheckIn: !prev.selfCheckIn,
                    }))
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    filters.selfCheckIn
                      ? "bg-black dark:bg-white"
                      : "bg-gray-200 dark:bg-[#383838]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white dark:bg-[#181818] shadow-md transition-transform ${
                      filters.selfCheckIn
                        ? "translate-x-5"
                        : "translate-x-0 bg-white"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MODAL FOOTER (STICKY)
        ========================================================================= */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] flex items-center justify-between gap-4 shrink-0 shadow-lg pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleClearAll}
            className="font-bold text-sm underline text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-2 py-2"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-8 py-3.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-2xl font-bold text-sm shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
          >
            {matchingListingsCount !== undefined
              ? `Show ${matchingListingsCount} place${matchingListingsCount !== 1 ? "s" : ""}`
              : "Apply filters"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

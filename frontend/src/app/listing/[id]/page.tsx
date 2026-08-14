"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  MapPin,
  Sparkles,
  Wifi,
  Tv,
  Car,
  Wind,
  ShieldCheck,
  Coffee,
  Utensils,
  Eye,
  Calendar as CalendarIcon,
  Award,
  KeyRound,
  MessageSquare,
  Tag,
} from "lucide-react";

import Header from "@/components/layout/header";
import { propertiesApi } from "@/lib/api/properties";
import { favoritesApi } from "@/lib/api/favorites";
import {
  getDetailedListingById,
  DetailedListing,
} from "@/data/detailed-listings";

// Dynamically import Leaflet Map to avoid SSR issues
const AirbnbMap = dynamic(() => import("@/components/map/airbnb-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-2xl bg-gray-100 dark:bg-[#222222] animate-pulse flex items-center justify-center text-gray-400">
      Loading interactive map...
    </div>
  ),
});

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = String(params.id);

  const [listing, setListing] = useState<DetailedListing>(
    getDetailedListingById(listingId)
  );
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Gallery Modal
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // All Amenities Modal
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);

  // Description expand
  const [descExpanded, setDescExpanded] = useState(false);

  // Booking parameters
  const [checkInDate, setCheckInDate] = useState("2026-08-28");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-30");
  const [guestCount, setGuestCount] = useState(2);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);

  // Backend Booked Date Ranges & Calendar state
  const [bookedRanges, setBookedRanges] = useState<{ id: number; check_in: string; check_out: string }[]>([]);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  // Active section for sticky sub-nav
  const [activeSection, setActiveSection] = useState("photos");
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const backendData = await propertiesApi.getById(listingId);
        if (backendData && backendData.title) {
          const fallback = getDetailedListingById(listingId);
          setListing({
            ...fallback,
            title: backendData.title || fallback.title,
            description: {
              intro: backendData.description || fallback.description.intro,
              space: fallback.description.space,
            },
            pricePerNight: backendData.price_per_night || fallback.pricePerNight,
            guests: backendData.max_guests || fallback.guests,
            bedrooms: backendData.bedrooms || fallback.bedrooms,
            bathrooms: backendData.bathrooms || fallback.bathrooms,
            location: backendData.location || fallback.location,
            images:
              backendData.images?.length > 0
                ? backendData.images
                : fallback.images,
          });
        }
      } catch (err) {
        // Use rich fallback mock data
        setListing(getDetailedListingById(listingId));
      }
    };

    fetchListing();

    // Fetch confirmed booked dates for dynamic calendar blocking
    propertiesApi
      .getBookedDates(listingId)
      .then((data) => {
        if (data && Array.isArray(data)) {
          setBookedRanges(data);
        }
      })
      .catch(() => {});

    // Check wishlist status
    const token = localStorage.getItem("token");
    if (token) {
      favoritesApi
        .getAll()
        .then((wishlist) => {
          const alreadyLiked = wishlist.some(
            (item: any) => String(item.listing_id) === listingId
          );
          setLiked(alreadyLiked);
        })
        .catch(() => {});
    }

    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 550);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [listingId]);

  const toggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save properties.");
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      if (liked) {
        await favoritesApi.remove(listingId);
        setLiked(false);
      } else {
        await favoritesApi.add(listingId);
        setLiked(true);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Check if a specific YYYY-MM-DD date string is reserved/booked
  const isDateBooked = (dateStr: string) => {
    return bookedRanges.some((range) => {
      return dateStr >= range.check_in && dateStr < range.check_out;
    });
  };

  // Check if selected booking range conflicts with any booked dates
  const isRangeConflicting = useMemo(() => {
    if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) return false;
    return bookedRanges.some((range) => {
      return checkInDate < range.check_out && checkOutDate > range.check_in;
    });
  }, [checkInDate, checkOutDate, bookedRanges]);

  // Dynamic Price & Night duration calculation
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 2;
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  const basePrice = listing.pricePerNight * nights;
  const originalPrice = (listing.originalPricePerNight || listing.pricePerNight * 2) * nights;
  const cleaningFee = 500;
  const serviceFee = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  // Today's date string in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr || isDateBooked(dateStr)) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(dateStr);
      setCheckOutDate("");
    } else if (checkInDate && !checkOutDate) {
      if (dateStr <= checkInDate) {
        setCheckInDate(dateStr);
      } else {
        // Check if any date in between is booked
        const start = new Date(checkInDate);
        const end = new Date(dateStr);
        let hasBlocked = false;
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          if (isDateBooked(`${y}-${m}-${day}`)) {
            hasBlocked = true;
            break;
          }
        }
        if (hasBlocked) {
          setCheckInDate(dateStr);
        } else {
          setCheckOutDate(dateStr);
        }
      }
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // Calendar Month targets
  const month1Date = useMemo(() => {
    const base = new Date();
    base.setMonth(base.getMonth() + calendarMonthOffset);
    return base;
  }, [calendarMonthOffset]);

  const month2Date = useMemo(() => {
    const base = new Date();
    base.setMonth(base.getMonth() + calendarMonthOffset + 1);
    return base;
  }, [calendarMonthOffset]);

  const renderMonthCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
      <div key={monthName} className="select-none">
        <h4 className="font-bold text-center text-sm text-gray-900 dark:text-white mb-4">
          {monthName}
        </h4>
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
          {weekdays.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-xs gap-y-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <span key={`empty-${i}`} className="p-2" />
          ))}
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isPast = dateStr < todayStr;
            const isBooked = isDateBooked(dateStr);
            const isStart = checkInDate === dateStr;
            const isEnd = checkOutDate === dateStr;
            const isInRange = checkInDate && checkOutDate && dateStr > checkInDate && dateStr < checkOutDate;

            let dayClasses = "rounded-full cursor-pointer transition text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]";

            if (isPast) {
              dayClasses = "line-through decoration-rose-500 decoration-[1.5px] text-gray-400 dark:text-gray-600 bg-transparent cursor-not-allowed opacity-40 font-normal hover:bg-transparent";
            } else if (isBooked) {
              dayClasses = "line-through text-gray-300 dark:text-gray-600 bg-gray-50/60 dark:bg-[#252525]/60 cursor-not-allowed font-normal";
            } else if (isStart || isEnd) {
              dayClasses = "bg-black dark:bg-white text-white dark:text-black font-bold rounded-full shadow-sm";
            } else if (isInRange) {
              dayClasses = "bg-gray-100 dark:bg-[#2c2c2c] text-gray-900 dark:text-white font-semibold rounded-none";
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast || isBooked}
                onClick={() => handleDateClick(dateStr)}
                title={isPast ? "Date has passed" : isBooked ? "Reserved / Unavailable" : dateStr}
                className={`w-full aspect-square flex items-center justify-center text-xs font-semibold ${dayClasses}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleReserve = () => {
    if (isRangeConflicting) {
      alert("Selected dates conflict with an existing reservation. Please pick available dates.");
      return;
    }
    router.push(
      `/booking/${listing.id}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guestCount}`
    );
  };

  const renderAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("kitchen") || n.includes("cook")) return <Utensils size={20} />;
    if (n.includes("wifi") || n.includes("internet")) return <Wifi size={20} />;
    if (n.includes("tv")) return <Tv size={20} />;
    if (n.includes("park") || n.includes("car")) return <Car size={20} />;
    if (n.includes("air") || n.includes("cool") || n.includes("fan")) return <Wind size={20} />;
    if (n.includes("coffee") || n.includes("kettle")) return <Coffee size={20} />;
    if (n.includes("alarm") || n.includes("smoke") || n.includes("safe")) return <ShieldCheck size={20} />;
    if (n.includes("view") || n.includes("patio") || n.includes("balcony")) return <Eye size={20} />;
    return <Sparkles size={20} />;
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 transition-colors duration-200">
      <Header />

      {/* STICKY SUB-NAV BAR (PHOTOS | AMENITIES | REVIEWS | LOCATION) */}
      <div
        className={`fixed top-20 left-0 right-0 z-40 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a] transition-all duration-200 ${
          isScrolledPastHero ? "shadow-sm py-3" : "py-4"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8 text-sm font-semibold">
            <button
              onClick={() => scrollToSection("photos")}
              className={`hover:text-black dark:hover:text-white pb-1 transition ${
                activeSection === "photos"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => scrollToSection("amenities")}
              className={`hover:text-black dark:hover:text-white pb-1 transition ${
                activeSection === "amenities"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Amenities
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className={`hover:text-black dark:hover:text-white pb-1 transition ${
                activeSection === "reviews"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("location")}
              className={`hover:text-black dark:hover:text-white pb-1 transition ${
                activeSection === "location"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Location
            </button>
          </div>

          {/* MINI SCROLLED RESERVE ACTION */}
          {isScrolledPastHero && (
            <div className="flex items-center gap-4 animate-in fade-in duration-200">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  ₹{listing.pricePerNight.toLocaleString("en-IN")}{" "}
                  <span className="font-normal text-xs text-gray-500 dark:text-gray-400">
                    night
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Star size={12} className="fill-black dark:fill-white text-black dark:text-white" />
                  <span>{listing.rating.toFixed(2)}</span>
                  <span>({listing.reviewCount})</span>
                </div>
              </div>
              <button
                onClick={handleReserve}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm hover:scale-[1.02]"
              >
                Reserve
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SHARE TOAST NOTIFICATION */}
      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#222222] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-5">
          <Check size={16} className="text-green-400" />
          Listing link copied to clipboard!
        </div>
      )}

      {/* =========================================================================
          MAIN CONTAINER
      ========================================================================= */}
      <div className="max-w-[1200px] mx-auto px-6 pt-36 pb-24" id="photos">
        {/* TITLE & HEADER CONTROLS (IMAGE 2) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {listing.title}
          </h1>

          <div className="flex items-center gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition underline"
            >
              <Share2 size={16} />
              Share
            </button>

            <button
              onClick={toggleLike}
              disabled={favoriteLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition underline"
            >
              <Heart
                size={16}
                className={
                  liked
                    ? "fill-[#FF385C] text-[#FF385C]"
                    : "text-gray-700 dark:text-gray-300"
                }
              />
              {liked ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* 5-PHOTO MOSAIC GRID (IMAGE 2) */}
        <div className="relative rounded-2xl overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[420px] md:h-[480px]">
          {/* Main Large Hero Image (Spans 2 cols & 2 rows) */}
          <div
            onClick={() => {
              setSelectedPhotoIndex(0);
              setGalleryOpen(true);
            }}
            className="md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden bg-gray-200 dark:bg-[#1e1e1e]"
          >
            <img
              src={listing.images[0] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition duration-300"
            />
          </div>

          {/* Top Right Photos */}
          <div
            onClick={() => {
              setSelectedPhotoIndex(1);
              setGalleryOpen(true);
            }}
            className="hidden md:block relative cursor-pointer group overflow-hidden bg-gray-200 dark:bg-[#1e1e1e]"
          >
            <img
              src={listing.images[1] || listing.images[0]}
              alt="Listing room view"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition duration-300"
            />
          </div>
          <div
            onClick={() => {
              setSelectedPhotoIndex(2);
              setGalleryOpen(true);
            }}
            className="hidden md:block relative cursor-pointer group overflow-hidden bg-gray-200 dark:bg-[#1e1e1e]"
          >
            <img
              src={listing.images[2] || listing.images[0]}
              alt="Listing bedroom view"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition duration-300"
            />
          </div>

          {/* Bottom Right Photos */}
          <div
            onClick={() => {
              setSelectedPhotoIndex(3);
              setGalleryOpen(true);
            }}
            className="hidden md:block relative cursor-pointer group overflow-hidden bg-gray-200 dark:bg-[#1e1e1e]"
          >
            <img
              src={listing.images[3] || listing.images[0]}
              alt="Listing interior"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition duration-300"
            />
          </div>
          <div
            onClick={() => {
              setSelectedPhotoIndex(4);
              setGalleryOpen(true);
            }}
            className="hidden md:block relative cursor-pointer group overflow-hidden bg-gray-200 dark:bg-[#1e1e1e]"
          >
            <img
              src={listing.images[4] || listing.images[0]}
              alt="Listing detail"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-95 transition duration-300"
            />
          </div>

          {/* "SHOW ALL PHOTOS" BUTTON (IMAGE 2) */}
          <button
            onClick={() => {
              setSelectedPhotoIndex(0);
              setGalleryOpen(true);
            }}
            className="absolute bottom-4 right-4 bg-white/95 dark:bg-[#1e1e1e]/95 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md border border-gray-200 dark:border-[#333333] hover:bg-white dark:hover:bg-[#2c2c2c] transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            Show all photos
          </button>
        </div>

        {/* =========================================================================
            CONTENT GRID (LEFT DETAILS + RIGHT FLOATING STICKY BOOKING CARD)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* ======================= LEFT COLUMN ======================= */}
          <div className="space-y-8">
            {/* SUBTITLE & SPECS WITH HOST IDENTITY VERIFIED BADGE */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-[#2a2a2a]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {listing.subtitle}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>
                    {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
                    {listing.beds} beds · {listing.bathrooms} bathrooms
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified ✓
                  </span>
                </div>
              </div>

              <div className="relative shrink-0">
                <img
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-[#333] shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white dark:ring-[#121212]" title="Identity Verified">
                  <ShieldCheck size={11} />
                </div>
              </div>
            </div>

            {/* GUEST FAVOURITE LAUREL CARD (IMAGE 2) */}
            {listing.isGuestFavorite && (
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#1a1a1a] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                      Guest favourite
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      One of the most loved homes on Airbnb, according to guests
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 border-l border-gray-200 dark:border-[#333333] pl-6">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {listing.rating.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-end gap-0.5 text-xs text-amber-500">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 underline font-semibold mt-1">
                    {listing.reviewCount} Reviews
                  </div>
                </div>
              </div>
            )}

            {/* HIGHLIGHTS SECTION (IMAGE 3) */}
            <div className="space-y-6 pb-8 border-b border-gray-200 dark:border-[#2a2a2a]">
              {listing.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#252525] text-gray-900 dark:text-gray-100 shrink-0 mt-0.5">
                    {h.title.toLowerCase().includes("top 5%") ? (
                      <Award size={20} className="text-amber-500" />
                    ) : h.title.toLowerCase().includes("cool") ? (
                      <Wind size={20} className="text-blue-500" />
                    ) : (
                      <KeyRound size={20} className="text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {h.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ABOUT THIS PLACE / DESCRIPTION (IMAGE 3) */}
            <div className="pb-8 border-b border-gray-200 dark:border-[#2a2a2a]">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About this place
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {listing.description.intro}
              </p>

              {descExpanded && (
                <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300 text-base animate-in fade-in">
                  <h4 className="font-bold text-gray-900 dark:text-white mt-4">
                    The space
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {listing.description.space.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="mt-4 font-bold text-gray-900 dark:text-white underline hover:text-black transition"
              >
                {descExpanded ? "Show less" : "Show more >"}
              </button>
            </div>

            {/* WHERE YOU'LL SLEEP (IMAGE 3) */}
            <div className="pb-8 border-b border-gray-200 dark:border-[#2a2a2a]">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Where you'll sleep
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {listing.bedroomsDetail.map((bed, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-4 bg-white dark:bg-[#1e1e1e]"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-100 dark:bg-[#252525]">
                      <img
                        src={bed.image}
                        alt={bed.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {bed.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {bed.bedType}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WHAT THIS PLACE OFFERS / AMENITIES (IMAGE 4) */}
            <div className="pb-8 border-b border-gray-200 dark:border-[#2a2a2a]" id="amenities">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                What this place offers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities
                  .flatMap((cat) => cat.items)
                  .slice(0, 10)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 text-gray-800 dark:text-gray-200 py-1"
                    >
                      <div className="text-gray-700 dark:text-gray-300">
                        {renderAmenityIcon(item.name)}
                      </div>
                      <span className="text-base">{item.name}</span>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setAmenitiesModalOpen(true)}
                className="mt-6 px-6 py-3 border border-black dark:border-white rounded-xl font-bold text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222] transition"
              >
                Show all 35 amenities
              </button>
            </div>

            {/* 2-MONTH INTERACTIVE CALENDAR WITH BACKEND DATE BLOCKING */}
            <div className="pb-8 border-b border-gray-200 dark:border-[#2a2a2a]" id="calendar">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {checkInDate && checkOutDate
                      ? `${nights} night${nights > 1 ? "s" : ""} in ${listing.location}`
                      : "Select check-in & check-out dates"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {checkInDate && checkOutDate
                      ? `${formatDateDisplay(checkInDate)} – ${formatDateDisplay(checkOutDate)}`
                      : "Add your travel dates for exact pricing and availability"}
                  </p>
                </div>

                {(checkInDate || checkOutDate) && (
                  <button
                    onClick={() => {
                      setCheckInDate("");
                      setCheckOutDate("");
                    }}
                    className="text-xs font-bold underline text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white self-start sm:self-auto"
                  >
                    Clear dates
                  </button>
                )}
              </div>

              {/* Conflict warning banner */}
              {isRangeConflicting && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Selected dates overlap with an existing reservation. Please pick available dates.</span>
                </div>
              )}

              {/* Side-by-side 2-Month Calendar */}
              <div className="border border-gray-200 dark:border-[#2a2a2a] rounded-3xl p-6 bg-white dark:bg-[#1a1a1a] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCalendarMonthOffset((prev) => Math.max(0, prev - 1))}
                    disabled={calendarMonthOffset === 0}
                    className="w-9 h-9 rounded-full border border-gray-200 dark:border-[#333] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Previous months"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Live availability synced with database
                  </span>

                  <button
                    onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
                    className="w-9 h-9 rounded-full border border-gray-200 dark:border-[#333] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white transition"
                    aria-label="Next months"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {renderMonthCalendar(month1Date)}
                  {renderMonthCalendar(month2Date)}
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-gray-100 dark:border-[#282828] text-xs font-medium text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-black dark:bg-white" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1a1a]" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-[9px] line-through text-gray-500">12</span>
                    <span>Reserved / Blocked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEWS & RATINGS BREAKDOWN (IMAGE 5) */}
            <div className="pb-8 border-b border-gray-200 dark:border-[#2a2a2a]" id="reviews">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Guest favourite
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This home is in the <span className="font-bold">top 5%</span>{" "}
                    of eligible listings based on ratings, reviews and reliability
                  </p>
                </div>
              </div>

              {/* Overall Ratings Breakdown Grid (Image 5) */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 py-6 border-y border-gray-200 dark:border-[#2a2a2a] text-center">
                <div className="border-r border-gray-200 dark:border-[#2a2a2a] pr-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cleanliness
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {listing.ratingsBreakdown.cleanliness}
                  </p>
                  <Sparkles size={22} className="mx-auto text-gray-700 dark:text-gray-300 mt-2" />
                </div>
                <div className="border-r border-gray-200 dark:border-[#2a2a2a] pr-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accuracy
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {listing.ratingsBreakdown.accuracy}
                  </p>
                  <Check size={22} className="mx-auto text-gray-700 dark:text-gray-300 mt-2" />
                </div>
                <div className="border-r border-gray-200 dark:border-[#2a2a2a] pr-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Check-in
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {listing.ratingsBreakdown.checkIn}
                  </p>
                  <KeyRound size={22} className="mx-auto text-gray-700 dark:text-gray-300 mt-2" />
                </div>
                <div className="border-r border-gray-200 dark:border-[#2a2a2a] pr-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Communication
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {listing.ratingsBreakdown.communication}
                  </p>
                  <MessageSquare size={22} className="mx-auto text-gray-700 dark:text-gray-300 mt-2" />
                </div>
                <div className="border-r border-gray-200 dark:border-[#2a2a2a] pr-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {listing.ratingsBreakdown.location}
                  </p>
                  <MapPin size={22} className="mx-auto text-gray-700 dark:text-gray-300 mt-2" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Value
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {listing.ratingsBreakdown.value}
                  </p>
                  <Tag size={22} className="mx-auto text-gray-700 dark:text-gray-300 mt-2" />
                </div>
              </div>

              {/* Tag Pills (Image 5) */}
              <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
                {listing.ratingsBreakdown.tagPills.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1e1e1e] text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap"
                  >
                    <span>{tag.name}</span>
                    <span className="text-gray-400">{tag.count}</span>
                  </div>
                ))}
              </div>

              {/* Review Cards Grid (Image 5) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                {listing.reviews.map((rev) => (
                  <div key={rev.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-[#333333]"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {rev.authorName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {rev.tenure}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-amber-500 font-bold">★★★★★</span>
                      <span>·</span>
                      <span>{rev.date}</span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WHERE YOU'LL BE / LOCATION MAP (IMAGE 1 & MAP) */}
            <div className="pb-8" id="location">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Where you'll be
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {listing.location}, {listing.country}
              </p>

              <div className="h-[360px] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2a2a2a]">
                <AirbnbMap
                  listings={[
                    {
                      id: listing.id,
                      title: listing.title,
                      price: listing.pricePerNight,
                      lat: listing.lat,
                      lng: listing.lng,
                    },
                  ]}
                  selectedListingId={listing.id}
                  center={[listing.lat, listing.lng]}
                  zoom={14}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* ======================= RIGHT STICKY BOOKING WIDGET (IMAGE 2, 3, 4) ======================= */}
          <div className="relative">
            <div className="sticky top-40 border border-gray-200 dark:border-[#2a2a2a] rounded-3xl p-6 shadow-xl bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white">
              {/* PRICES INCLUDE ALL FEES BADGE */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold mb-4 border border-pink-100 dark:border-pink-900/40">
                🏷️ Prices include all fees
              </div>

              {/* PRICE HEADER */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  ₹{basePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  for {nights} nights
                </span>
              </div>

              {/* CHECK-IN / CHECKOUT BOX */}
              <div className="border border-gray-300 dark:border-[#333333] rounded-2xl overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b border-gray-300 dark:border-[#333333]">
                  <div className="p-3 border-r border-gray-300 dark:border-[#333333]">
                    <label className="block text-[10px] font-black uppercase text-gray-700 dark:text-gray-300">
                      CHECK-IN
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white cursor-pointer mt-0.5"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-black uppercase text-gray-700 dark:text-gray-300">
                      CHECKOUT
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full text-xs font-semibold bg-transparent text-gray-900 dark:text-white cursor-pointer mt-0.5"
                    />
                  </div>
                </div>

                {/* GUESTS SELECTOR */}
                <div
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222222] transition relative"
                >
                  <label className="block text-[10px] font-black uppercase text-gray-700 dark:text-gray-300">
                    GUESTS
                  </label>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-900 dark:text-white mt-0.5">
                    <span>
                      {guestCount} guest{guestCount > 1 ? "s" : ""}
                    </span>
                    <span>▾</span>
                  </div>

                  {guestDropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] rounded-2xl p-4 shadow-2xl z-30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            Adults
                          </p>
                          <p className="text-[10px] text-gray-500">Age 13+</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setGuestCount(Math.max(1, guestCount - 1))
                            }
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold">
                            {guestCount}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setGuestCount(
                                Math.min(listing.guests, guestCount + 1)
                              )
                            }
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FREE CANCELLATION NOTE */}
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-4 text-center">
                ✓ Free cancellation before 27 August
              </p>

              {/* CONFLICT WARNING IN WIDGET */}
              {isRangeConflicting && (
                <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-[11px] font-semibold text-center">
                  ⚠️ Dates unavailable (already booked)
                </div>
              )}

              {/* RESERVE BUTTON */}
              <button
                onClick={handleReserve}
                disabled={isRangeConflicting || !checkInDate || !checkOutDate}
                className="w-full bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRangeConflicting ? "Dates Unavailable" : "Reserve"}
              </button>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                You won't be charged yet
              </p>

              {/* PRICE BREAKDOWN */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#333333] space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span className="underline">
                    ₹{listing.pricePerNight.toLocaleString("en-IN")} × {nights}{" "}
                    nights
                  </span>
                  <span>₹{basePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>₹{cleaningFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">AirClone service fee</span>
                  <span>₹{serviceFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-[#333333] flex justify-between font-bold text-base text-gray-900 dark:text-white">
                  <span>Total before taxes</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ALL PHOTOS FULLSCREEN LIGHTBOX / GALLERY MODAL
      ========================================================================= */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setGalleryOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:opacity-75 transition"
            >
              <X size={24} />
              Close photos
            </button>
            <span className="text-sm text-gray-400">
              {selectedPhotoIndex + 1} / {listing.images.length}
            </span>
          </div>

          {/* MAIN PREVIEW IMAGE */}
          <div className="relative max-w-5xl mx-auto flex items-center justify-center my-auto w-full h-[70vh]">
            <img
              src={listing.images[selectedPhotoIndex]}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />

            {/* PREV BUTTON */}
            {selectedPhotoIndex > 0 && (
              <button
                onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                className="absolute left-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* NEXT BUTTON */}
            {selectedPhotoIndex < listing.images.length - 1 && (
              <button
                onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                className="absolute right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* THUMBNAILS BAR */}
          <div className="flex gap-3 overflow-x-auto justify-center py-2 max-w-4xl mx-auto scrollbar-hide">
            {listing.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Thumbnail"
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-16 h-12 rounded-lg object-cover cursor-pointer transition ${
                  selectedPhotoIndex === idx
                    ? "ring-2 ring-white scale-105"
                    : "opacity-40 hover:opacity-80"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ALL AMENITIES MODAL
      ========================================================================= */}
      {amenitiesModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 border border-gray-200 dark:border-[#333333] shadow-2xl relative">
            <button
              onClick={() => setAmenitiesModalOpen(false)}
              className="sticky top-0 float-right w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2c2c2c] flex items-center justify-center text-gray-700 dark:text-gray-300"
            >
              <X size={18} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What this place offers
            </h3>

            <div className="space-y-8">
              {listing.amenities.map((cat, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-[#2a2a2a]">
                    {cat.category}
                  </h4>
                  <div className="space-y-4">
                    {cat.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 text-gray-800 dark:text-gray-200"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-base">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
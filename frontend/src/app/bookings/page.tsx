"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  MapPin,
  Star,
  MessageSquare,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Luggage,
} from "lucide-react";

import Header from "@/components/layout/header";
import WriteReviewModal from "@/components/bookings/write-review-modal";
import MessagesModal from "@/components/shared/messages-modal";
import { bookingsApi } from "@/lib/api/bookings";
import { propertiesApi } from "@/lib/api/properties";
import type { Booking } from "@/types";

interface ListingInfo {
  id: string;
  title: string;
  location: string;
  image?: string;
  pricePerNight?: number;
}

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listingInfo, setListingInfo] = useState<Record<string, ListingInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<{
    id: string;
    propertyId: string;
    title: string;
    location: string;
    checkIn: string;
    checkOut: string;
  } | null>(null);

  // Messages modal state
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  // Persisted local reviews
  const [reviewedBookings, setReviewedBookings] = useState<
    Record<string, { rating: number; comment: string; date: string }>
  >({});

  useEffect(() => {
    // Load reviews from localStorage
    try {
      const stored = localStorage.getItem("airclone_submitted_reviews");
      if (stored) {
        setReviewedBookings(JSON.parse(stored));
      }
    } catch {}

    const loadBookings = async () => {
      try {
        const data = await bookingsApi.getMyBookings();
        setBookings(data);

        // Get unique listing IDs
        const listingIds = [...new Set(data.map((booking) => booking.propertyId))];

        // Fetch listing details
        const listings = await Promise.all(
          listingIds.map(async (id) => {
            try {
              const listing = await propertiesApi.getById(id);
              return {
                id: String(listing.id),
                title: listing.title,
                location: listing.location,
                image: listing.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
                pricePerNight: listing.price_per_night,
              };
            } catch (err) {
              return {
                id: String(id),
                title: `Listing #${id}`,
                location: "India",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
              };
            }
          })
        );

        const listingMap: Record<string, ListingInfo> = {};
        listings.forEach((l) => {
          if (l) listingMap[l.id] = l;
        });

        setListingInfo(listingMap);
      } catch (err: any) {
        console.error("Failed to load bookings:", err);
        if (err?.response?.status === 401) {
          setError("Please log in to view your trips.");
        } else {
          setError("Unable to load your trips. Showing recent activity.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleReviewSubmitted = (bookingId: string, rating: number, comment: string) => {
    const updated = {
      ...reviewedBookings,
      [bookingId]: {
        rating,
        comment,
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      },
    };
    setReviewedBookings(updated);
    try {
      localStorage.setItem("airclone_submitted_reviews", JSON.stringify(updated));
    } catch {}
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Pending
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 transition-colors duration-200">
      <Header />

      <div className="pt-[220px] pb-24 max-w-5xl mx-auto px-6">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              My Trips & Reservations
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your upcoming, past, and confirmed stays with trip management tools.
            </p>
          </div>

          <button
            onClick={() => setIsMessagesOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#202020] text-xs font-bold transition shadow-sm self-start sm:self-auto"
          >
            <MessageSquare size={15} className="text-[#FF385C]" />
            <span>Host Inbox</span>
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#FF385C] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Loading your trips and reservations...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && bookings.length === 0 && (
          <div className="rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              {error}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 rounded-xl bg-[#FF385C] text-white font-bold text-xs shadow-md"
            >
              Explore Homes
            </button>
          </div>
        )}

        {/* NO BOOKINGS EMPTY STATE */}
        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-3xl border border-gray-200 dark:border-[#2a2a2a] p-12 text-center bg-gray-50/50 dark:bg-[#181818] space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <Luggage className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              No trips booked... yet!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Time to dust off your bags and start planning your next great adventure across India.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-2 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] px-8 py-3.5 text-white font-bold text-sm shadow-md transition"
            >
              Start Searching
            </button>
          </div>
        )}

        {/* BOOKINGS LIST */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const listing = listingInfo[booking.propertyId] || {
                id: String(booking.propertyId),
                title: `AirClone Stay #${booking.propertyId}`,
                location: "India",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
              };

              const existingReview = reviewedBookings[booking.id];

              return (
                <article
                  key={booking.id}
                  className="border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  {/* LEFT: IMAGE & DETAILS */}
                  <div className="flex items-start sm:items-center gap-5 flex-1 min-w-0">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-gray-200 dark:border-[#333]"
                    />

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {listing.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={13} className="shrink-0 text-rose-500" />
                        <span className="truncate">{listing.location}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-gray-400" />
                          <span className="font-semibold">
                            {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-gray-400" />
                          <span>
                            {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* REVIEW BADGE IF SUBMITTED */}
                      {existingReview && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span>Your review: {existingReview.rating}.0 ★</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            ({existingReview.date})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: PRICE, STATUS & ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-[#252525]">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.status)}
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        ₹{booking.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {/* WRITE A REVIEW BUTTON */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBookingForReview({
                            id: String(booking.id),
                            propertyId: String(booking.propertyId),
                            title: listing.title,
                            location: listing.location,
                            checkIn: booking.checkIn,
                            checkOut: booking.checkOut,
                          })
                        }
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition shadow-sm cursor-pointer"
                      >
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{existingReview ? "Edit review" : "Write a review"}</span>
                      </button>

                      {/* VIEW STAY LINK */}
                      <button
                        type="button"
                        onClick={() => router.push(`/listing/${booking.propertyId}`)}
                        className="px-3 py-2 rounded-xl border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#252525] text-xs font-semibold text-gray-700 dark:text-gray-300 transition"
                      >
                        View Stay
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* WRITE A REVIEW MODAL */}
      <WriteReviewModal
        isOpen={Boolean(selectedBookingForReview)}
        booking={selectedBookingForReview}
        onClose={() => setSelectedBookingForReview(null)}
        onSubmitSuccess={handleReviewSubmitted}
      />

      {/* HOST MESSAGES MODAL */}
      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />
    </main>
  );
}
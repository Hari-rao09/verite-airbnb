"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  MapPin,
} from "lucide-react";

import { bookingsApi } from "@/lib/api/bookings";
import { propertiesApi } from "@/lib/api/properties";
import type { Booking } from "@/types";

interface ListingInfo {
  id: string;
  title: string;
  location: string;
}

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listingInfo, setListingInfo] = useState<
    Record<string, ListingInfo>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingsApi.getMyBookings();

        setBookings(data);

        // Get unique listing IDs
        const listingIds = [
          ...new Set(data.map((booking) => booking.propertyId)),
        ];

        // Fetch listing details
        const listings = await Promise.all(
          listingIds.map(async (id) => {
            try {
              const listing = await propertiesApi.getById(id);

              return {
                id: String(listing.id),
                title: listing.title,
                location: listing.location,
              };
            } catch (error) {
              console.error(
                `Failed to load listing ${id}:`,
                error
              );

              return null;
            }
          })
        );

        // Convert into an object for quick lookup
        const listingMap: Record<string, ListingInfo> = {};

        listings.forEach((listing) => {
          if (listing) {
            listingMap[listing.id] = listing;
          }
        });

        setListingInfo(listingMap);
      } catch (error: any) {
        console.error("Failed to load bookings:", error);

        if (error?.response?.status === 401) {
          setError("Please log in to view your bookings.");
        } else {
          setError("Unable to load your bookings.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-medium hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-semibold mb-2">
          My bookings
        </h1>

        <p className="text-gray-500 mb-8">
          View and manage your reservations.
        </p>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-gray-500">
            Loading your bookings...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            <p>{error}</p>

            <button
              onClick={() => router.push("/")}
              className="mt-4 rounded-lg bg-[#FF385C] px-5 py-2 text-white font-medium"
            >
              Go home
            </button>
          </div>
        )}

        {/* No bookings */}
        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-2xl border p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No bookings yet
            </h2>

            <p className="text-gray-500 mb-6">
              Your reservations will appear here.
            </p>

            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-[#FF385C] px-6 py-3 text-white font-semibold"
            >
              Explore stays
            </button>
          </div>
        )}

        {/* Bookings */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">

            {bookings.map((booking) => {
              const listing =
                listingInfo[booking.propertyId];

              return (
                <article
                  key={booking.id}
                  className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    {/* Property */}
                    <div>
                      <h2 className="text-xl font-semibold">
                        {listing?.title ||
                          `Listing #${booking.propertyId}`}
                      </h2>

                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin className="w-4 h-4" />

                        <span>
                          {listing?.location ||
                            "Your reservation"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`w-fit px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="border-t my-5" />

                  {/* Booking details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                    {/* Dates */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <CalendarDays className="w-4 h-4" />

                        <span className="text-sm">
                          Dates
                        </span>
                      </div>

                      <p className="font-medium">
                        {formatDate(booking.checkIn)}
                      </p>

                      <p className="text-gray-500">
                        to {formatDate(booking.checkOut)}
                      </p>
                    </div>

                    {/* Guests */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Users className="w-4 h-4" />

                        <span className="text-sm">
                          Guests
                        </span>
                      </div>

                      <p className="font-medium">
                        {booking.guests}{" "}
                        {booking.guests === 1
                          ? "guest"
                          : "guests"}
                      </p>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total price
                      </p>

                      <p className="text-xl font-semibold">
                        ₹
                        {booking.totalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                  </div>
                </article>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}
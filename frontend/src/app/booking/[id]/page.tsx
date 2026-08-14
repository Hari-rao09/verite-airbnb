"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

import { apiClient } from "@/lib/api/client";
import { bookingsApi } from "@/lib/api/bookings";

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
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listing, setListing] = useState<Listing | null>(null);

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 1);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await apiClient.get<Listing>(
          `/listings/${params.id}`
        );

        setListing(response.data);
      } catch (error) {
        console.error("Failed to load listing:", error);
        setError("Unable to load listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  const totalPrice =
    listing && nights > 0
      ? nights * listing.price_per_night
      : 0;

  const handleBooking = async () => {
    setError("");

    if (!localStorage.getItem("token")) {
      router.push("/");
      alert("Please log in to make a reservation.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (guests < 1 || guests > (listing?.max_guests ?? 1)) {
      setError(
        `Maximum ${listing?.max_guests} guests allowed.`
      );
      return;
    }

    try {
      setBooking(true);

      await bookingsApi.create({
        propertyId: String(params.id),
        checkIn,
        checkOut,
        guests,
      });

      // Booking successful
      router.push("/bookings");

    } catch (error: any) {
      console.error("Booking failed:", error);

      if (error?.response?.status === 401) {
        setError("Please log in to make a reservation.");
      } else {
        const message =
          error?.response?.data?.detail ||
          "Booking failed. Please try again.";

        setError(message);
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading...
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

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
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

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-semibold mb-8">
          Reserve your stay
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* BOOKING FORM */}
          <div>

            <h2 className="text-xl font-semibold mb-6">
              Your trip
            </h2>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-4 mb-5">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Check-in
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);

                    if (
                      checkOut &&
                      e.target.value >= checkOut
                    ) {
                      setCheckOut("");
                    }
                  }}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Check-out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(e.target.value)
                  }
                  min={
                    checkIn ||
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

            </div>

            {/* GUESTS */}
            <div className="mb-6">

              <label className="block text-sm font-semibold mb-2">
                Guests
              </label>

              <select
                value={guests}
                onChange={(e) =>
                  setGuests(Number(e.target.value))
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                {Array.from(
                  { length: listing.max_guests },
                  (_, index) => index + 1
                ).map((number) => (
                  <option
                    key={number}
                    value={number}
                  >
                    {number}{" "}
                    {number === 1
                      ? "guest"
                      : "guests"}
                  </option>
                ))}
              </select>

            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-4 mb-4">
                {error}
              </div>
            )}

            {/* RESERVE */}
            <button
              onClick={handleBooking}
              disabled={booking}
              className="w-full bg-[#FF385C] text-white font-semibold py-4 rounded-lg hover:bg-[#e31c5a] disabled:opacity-60"
            >
              {booking
                ? "Booking..."
                : "Confirm reservation"}
            </button>

          </div>

          {/* LISTING SUMMARY */}
          <div className="border rounded-2xl p-6 h-fit shadow-sm">

            <div className="mb-5">

              <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center mb-5">
                <span className="text-5xl">
                  🏠
                </span>
              </div>

              <h2 className="text-xl font-semibold">
                {listing.title}
              </h2>

              <p className="text-gray-500 mt-1">
                {listing.location}
              </p>

              <div className="flex items-center gap-1 mt-3">
                <Star className="w-4 h-4 fill-black" />
                <span>5.0</span>
              </div>

            </div>

            <hr className="my-5" />

            {/* PRICE PER NIGHT */}
            <div className="flex justify-between mb-3">
              <span>
                ₹
                {listing.price_per_night.toLocaleString(
                  "en-IN"
                )}{" "}
                × {nights || 0}{" "}
                {nights === 1 ? "night" : "nights"}
              </span>

              <span>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between font-semibold text-lg pt-3 border-t">
              <span>
                Total
              </span>

              <span>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
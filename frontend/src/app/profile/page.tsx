"use client";

import Header from "@/components/layout/header";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Pencil,
  X,
  Trash2,
  MapPin,
  Star,
  Luggage,
  Users,
  Home,
  Receipt,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  Phone,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { propertiesApi } from "@/lib/api/properties";
import { bookingsApi } from "@/lib/api/bookings";
import type { HostReservation } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
  is_host?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [hostReservations, setHostReservations] = useState<HostReservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Host dashboard tabs & filters
  const [hostTab, setHostTab] = useState<"listings" | "reservations">("listings");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");
  const [reservationSearch, setReservationSearch] = useState("");

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Listing deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Contact Guest Modal
  const [contactReservation, setContactReservation] = useState<HostReservation | null>(null);
  const [contactMessage, setContactMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  /*
   * Load profile + host listings + host reservations
   */
  useEffect(() => {
    const loadProfileAndData = async () => {
      try {
        setLoading(true);
        // 1. Get logged-in user profile
        const profile = await authApi.getProfile();
        setUser(profile);

        // 2. Get all listings & filter to this host
        const listings = await propertiesApi.getAll();
        const userListings = listings.filter(
          (listing) => String(listing.hostId) === String(profile.id)
        );
        setMyListings(userListings);

        // 3. Get reservations made on this host's listings
        try {
          const reservations = await bookingsApi.getHostReservations();
          setHostReservations(reservations);
        } catch (resErr) {
          console.warn("Could not fetch host reservations:", resErr);
        }
      } catch (error) {
        console.error("Failed to load profile/listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndData();
  }, []);

  /*
   * User information
   */
  const name = user?.name || "Guest";
  const initial = name.charAt(0).toUpperCase();

  /*
   * Open edit profile modal
   */
  const handleEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditEmail(user.email);
    setError("");
    setIsEditing(true);
  };

  /*
   * Save profile changes
   */
  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedUser = await authApi.updateProfile({
        name: editName,
        email: editEmail,
      });

      setUser(updatedUser);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Delete listing
   */
  const handleDeleteListing = async (listingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(listingId);
      await propertiesApi.delete(listingId);
      setMyListings((currentListings) =>
        currentListings.filter((listing) => String(listing.id) !== String(listingId))
      );
      alert("Listing deleted successfully.");
    } catch (error) {
      console.error("Failed to delete listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Update Reservation Status (Host Action)
   */
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      await bookingsApi.updateStatus(bookingId, newStatus);
      setHostReservations((prev) =>
        prev.map((res) =>
          res.id === bookingId ? { ...res, status: newStatus.toUpperCase() } : res
        )
      );
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Could not update reservation status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * Financial & Performance Calculations
   */
  const metrics = useMemo(() => {
    const validReservations = hostReservations.filter((r) => r.status !== "CANCELLED");
    const totalEarnings = validReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const totalGuestsHosted = validReservations.reduce((sum, r) => sum + (r.guests || 1), 0);
    const confirmedCount = hostReservations.filter((r) => r.status === "CONFIRMED").length;
    const completedCount = hostReservations.filter((r) => r.status === "COMPLETED").length;
    const cancelledCount = hostReservations.filter((r) => r.status === "CANCELLED").length;

    return {
      totalEarnings,
      totalGuestsHosted,
      totalReservations: hostReservations.length,
      confirmedCount,
      completedCount,
      cancelledCount,
      activeProperties: myListings.length,
    };
  }, [hostReservations, myListings]);

  /*
   * Filtered Host Reservations
   */
  const filteredReservations = useMemo(() => {
    return hostReservations.filter((r) => {
      // Status filter
      if (statusFilter !== "ALL" && r.status !== statusFilter) {
        return false;
      }
      // Search query filter
      if (reservationSearch.trim()) {
        const query = reservationSearch.toLowerCase();
        const matchGuest = r.guest?.name?.toLowerCase().includes(query);
        const matchEmail = r.guest?.email?.toLowerCase().includes(query);
        const matchTitle = r.listing?.title?.toLowerCase().includes(query);
        const matchLoc = r.listing?.location?.toLowerCase().includes(query);
        return matchGuest || matchEmail || matchTitle || matchLoc;
      }
      return true;
    });
  }, [hostReservations, statusFilter, reservationSearch]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 transition-colors duration-200">
      <Header />

      <div className="pt-[220px] pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 lg:gap-14">

            {/* ===================================================== */}
            {/* LEFT SIDEBAR NAVIGATION */}
            {/* ===================================================== */}
            <aside className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Profile
              </h1>

              <nav className="space-y-2">
                {/* About me */}
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-gray-100 dark:bg-[#1e1e1e] text-left font-semibold text-gray-900 dark:text-white transition shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm font-bold">
                    {initial}
                  </div>
                  About me
                </button>

                {/* My Trips (Guest Bookings) */}
                <a
                  href="/bookings"
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition text-gray-700 dark:text-gray-300 font-medium group"
                >
                  <Luggage className="w-5 h-5 text-gray-500 group-hover:text-black dark:group-hover:text-white transition" />
                  <span>My Trips (Bookings)</span>
                </a>

                {/* Wishlists */}
                <a
                  href="/wishlists"
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition text-gray-700 dark:text-gray-300 font-medium group"
                >
                  <Star className="w-5 h-5 text-gray-500 group-hover:text-black dark:group-hover:text-white transition" />
                  <span>Wishlists</span>
                </a>
              </nav>

              {/* Identity Verification Card */}
              <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Identity Verified ✓</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {name}&apos;s verified info
                </h4>
                <ul className="text-xs space-y-2.5 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Government ID verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Email address confirmed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Phone number confirmed</span>
                  </li>
                </ul>
              </div>

              {/* Host Quick Status Card */}
              <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-gradient-to-br from-gray-50 to-white dark:from-[#181818] dark:to-[#1e1e1e] space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
                  <Award className="w-4 h-4" />
                  <span>Host Status</span>
                </div>
                <div className="text-base font-bold text-gray-900 dark:text-white">
                  {myListings.length > 0 ? "Active Superhost" : "Host Profile"}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {myListings.length > 0
                    ? `You manage ${myListings.length} listing${myListings.length > 1 ? "s" : ""} across India.`
                    : "Become a host to list your property and receive reservations."}
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/become-a-host")}
                  className="w-full py-2.5 px-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition"
                >
                  + Create New Listing
                </button>
              </div>
            </aside>

            {/* ===================================================== */}
            {/* RIGHT MAIN CONTENT */}
            {/* ===================================================== */}
            <section className="space-y-12">

              {/* USER PROFILE SUMMARY CARD */}
              <div className="border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#E00B41] flex items-center justify-center text-3xl font-extrabold text-white shadow-md">
                      {initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {name}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified ✓
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user?.email || "guest@airclone.com"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{myListings.length} Listed Properties</span>
                        <span>•</span>
                        <span>{hostReservations.length} Guest Reservations</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-800 dark:text-gray-200 text-sm font-semibold transition"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit profile
                  </button>
                </div>
              </div>

              {/* ===================================================== */}
              {/* HOST DASHBOARD SECTION (TABS) */}
              {/* ===================================================== */}
              <div className="space-y-8">
                {/* TAB SWITCHER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#2a2a2a] pb-4">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1e1e1e] p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setHostTab("listings")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                        hostTab === "listings"
                          ? "bg-white dark:bg-[#2c2c2c] text-black dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>My Listings</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-[#383838] text-gray-800 dark:text-gray-200">
                        {myListings.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHostTab("reservations")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                        hostTab === "reservations"
                          ? "bg-white dark:bg-[#2c2c2c] text-black dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Reservations & Earnings</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-[#FF385C] text-white font-bold">
                        {hostReservations.length}
                      </span>
                    </button>
                  </div>

                  {hostTab === "listings" ? (
                    <button
                      type="button"
                      onClick={() => router.push("/become-a-host")}
                      className="bg-[#FF385C] hover:bg-[#E00B41] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center gap-2"
                    >
                      <span>+ Add Listing</span>
                    </button>
                  ) : null}
                </div>

                {/* =================================================== */}
                {/* TAB 1: MY LISTINGS GRID */}
                {/* =================================================== */}
                {hostTab === "listings" && (
                  <div className="space-y-6">
                    {myListings.length === 0 ? (
                      <div className="border border-dashed border-gray-300 dark:border-[#383838] rounded-3xl p-12 text-center bg-gray-50/50 dark:bg-[#181818]/50 space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                          <Home className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          You don't have any listings yet
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          Share your room, flat, or entire villa with guests from all around the world and earn guaranteed payouts.
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/become-a-host")}
                          className="mt-2 bg-[#FF385C] hover:bg-[#E00B41] text-white px-6 py-3 rounded-xl font-bold transition shadow-md"
                        >
                          Create your first listing
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myListings.map((listing) => (
                          <div
                            key={listing.id}
                            className="border border-gray-200 dark:border-[#2a2a2a] rounded-3xl overflow-hidden bg-white dark:bg-[#181818] hover:shadow-lg transition flex flex-col group"
                          >
                            <div
                              className="h-52 bg-gray-100 dark:bg-[#252525] cursor-pointer overflow-hidden relative"
                              onClick={() => router.push(`/listing/${listing.id}`)}
                            >
                              <img
                                src={
                                  listing.images?.[0] ||
                                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                                }
                                alt={listing.title || "Property"}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {listing.propertyType || "Home"}
                              </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                                    {listing.title}
                                  </h3>
                                  <div className="flex items-center gap-1 text-xs font-bold shrink-0">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>5.0</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-2">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{listing.location || listing.city || "India"}</span>
                                </div>

                                <p className="mt-3 font-bold text-gray-900 dark:text-white text-base">
                                  ₹{Number(listing.price || 0).toLocaleString("en-IN")}{" "}
                                  <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/ night</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-[#252525]">
                                <button
                                  type="button"
                                  onClick={() => router.push(`/listing/${listing.id}/edit`)}
                                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-[#383838] rounded-xl py-2 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#252525] transition"
                                >
                                  <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingId === String(listing.id)}
                                  onClick={() => handleDeleteListing(String(listing.id))}
                                  className="flex-1 flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/40 rounded-xl py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition disabled:opacity-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {deletingId === String(listing.id) ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* =================================================== */}
                {/* TAB 2: RESERVATIONS ON MY LISTINGS & EARNINGS */}
                {/* =================================================== */}
                {hostTab === "reservations" && (
                  <div className="space-y-8">
                    {/* FINANCIAL & BOOKINGS METRICS RIBBON */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Metric 1: Total Payouts */}
                      <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                          <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">
                          ₹{metrics.totalEarnings.toLocaleString("en-IN")}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">From confirmed stays</p>
                      </div>

                      {/* Metric 2: Total Reservations */}
                      <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                          <span className="text-xs font-bold uppercase tracking-wider">Reservations</span>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Calendar className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">
                          {metrics.totalReservations}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{metrics.confirmedCount} upcoming / active</p>
                      </div>

                      {/* Metric 3: Guests Hosted */}
                      <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                          <span className="text-xs font-bold uppercase tracking-wider">Guests Hosted</span>
                          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">
                          {metrics.totalGuestsHosted}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Verified travelers</p>
                      </div>

                      {/* Metric 4: Active Listings */}
                      <div className="p-5 rounded-3xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                          <span className="text-xs font-bold uppercase tracking-wider">Properties</span>
                          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <Home className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">
                          {metrics.activeProperties}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">100% active on search</p>
                      </div>
                    </div>

                    {/* STATUS FILTER PILLS & SEARCH */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                        {(["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                              statusFilter === st
                                ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm"
                                : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
                            }`}
                          >
                            {st === "ALL" && `All Bookings (${hostReservations.length})`}
                            {st === "CONFIRMED" && `Confirmed (${metrics.confirmedCount})`}
                            {st === "COMPLETED" && `Completed (${metrics.completedCount})`}
                            {st === "CANCELLED" && `Cancelled (${metrics.cancelledCount})`}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={reservationSearch}
                        onChange={(e) => setReservationSearch(e.target.value)}
                        placeholder="Search guest or listing..."
                        className="w-full sm:w-64 px-4 py-2 text-xs font-medium rounded-xl border border-gray-300 dark:border-[#383838] bg-gray-50 dark:bg-[#1e1e1e] focus:border-black dark:focus:border-white outline-none transition"
                      />
                    </div>

                    {/* RESERVATIONS LIST */}
                    {filteredReservations.length === 0 ? (
                      <div className="border border-dashed border-gray-300 dark:border-[#383838] rounded-3xl p-12 text-center bg-gray-50/50 dark:bg-[#181818]/50 space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 dark:bg-[#252525] flex items-center justify-center text-gray-400">
                          <Receipt className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          No reservations found
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                          {statusFilter !== "ALL"
                            ? `You do not have any ${statusFilter.toLowerCase()} reservations matching your filter.`
                            : "As guests book your properties, their reservations, guest details, and payouts will appear right here."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {filteredReservations.map((reservation) => {
                          const isConfirmed = reservation.status === "CONFIRMED";
                          const isCompleted = reservation.status === "COMPLETED";
                          const isCancelled = reservation.status === "CANCELLED";

                          return (
                            <div
                              key={reservation.id}
                              className="border border-gray-200 dark:border-[#2a2a2a] rounded-3xl p-6 bg-white dark:bg-[#181818] shadow-sm hover:shadow-md transition space-y-6"
                            >
                              {/* Top Bar: Property info & Status Badge */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div
                                    onClick={() => router.push(`/listing/${reservation.listing?.id}`)}
                                    className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#252525] shrink-0 cursor-pointer group"
                                  >
                                    <img
                                      src={
                                        reservation.listing?.imageUrl ||
                                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80"
                                      }
                                      alt={reservation.listing?.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                    />
                                  </div>
                                  <div>
                                    <h4
                                      onClick={() => router.push(`/listing/${reservation.listing?.id}`)}
                                      className="text-base font-bold text-gray-900 dark:text-white hover:underline cursor-pointer line-clamp-1"
                                    >
                                      {reservation.listing?.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      <MapPin className="w-3.5 h-3.5" />
                                      <span>{reservation.listing?.location}</span>
                                      <span>•</span>
                                      <span className="capitalize">{reservation.listing?.propertyType}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* STATUS PILL */}
                                <div className="shrink-0">
                                  {isConfirmed && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                                    </span>
                                  )}
                                  {isCompleted && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                      <Award className="w-3.5 h-3.5" /> Completed Stay
                                    </span>
                                  )}
                                  {isCancelled && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                      <XCircle className="w-3.5 h-3.5" /> Cancelled
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Middle Grid: Guest Details + Trip Dates + Payout */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 rounded-2xl bg-gray-50 dark:bg-[#202020] border border-gray-100 dark:border-[#2a2a2a]">
                                {/* 1. Guest Info */}
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Guest</span>
                                  <div className="flex items-center gap-2.5 pt-0.5">
                                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                      {reservation.guest?.name?.charAt(0) || "G"}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {reservation.guest?.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {reservation.guest?.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. Stay Duration */}
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Dates & Guests</span>
                                  <div className="text-sm font-bold text-gray-900 dark:text-white pt-0.5 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{formatDate(reservation.checkIn)} – {formatDate(reservation.checkOut)}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {reservation.nights} night{reservation.nights > 1 ? "s" : ""} • {reservation.guests} guest{reservation.guests > 1 ? "s" : ""}
                                  </div>
                                </div>

                                {/* 3. Payout Amount */}
                                <div className="space-y-1 sm:text-right">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Host Payout</span>
                                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 pt-0.5">
                                    ₹{Number(reservation.totalPrice || 0).toLocaleString("en-IN")}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    ₹{reservation.listing?.pricePerNight?.toLocaleString("en-IN")} / night
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Action Controls */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContactReservation(reservation);
                                    setContactMessage(`Hi ${reservation.guest?.name}, thank you for booking ${reservation.listing?.title}! Let me know if you need any assistance with check-in.`);
                                    setMessageSent(false);
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#252525] text-xs font-bold text-gray-800 dark:text-gray-200 transition"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Contact Guest
                                </button>

                                <div className="flex items-center gap-2">
                                  {isConfirmed && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={updatingId === reservation.id}
                                        onClick={() => handleUpdateStatus(reservation.id, "completed")}
                                        className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition disabled:opacity-50"
                                      >
                                        Mark as Completed
                                      </button>
                                      <button
                                        type="button"
                                        disabled={updatingId === reservation.id}
                                        onClick={() => {
                                          if (window.confirm("Are you sure you want to cancel this guest's reservation?")) {
                                            handleUpdateStatus(reservation.id, "cancelled");
                                          }
                                        }}
                                        className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/40 transition disabled:opacity-50"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                  {isCancelled && (
                                    <button
                                      type="button"
                                      disabled={updatingId === reservation.id}
                                      onClick={() => handleUpdateStatus(reservation.id, "confirmed")}
                                      className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition disabled:opacity-50"
                                    >
                                      Re-Confirm Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </section>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* CONTACT GUEST MODAL */}
      {/* ===================================================== */}
      {contactReservation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setContactReservation(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1e1e1e] p-7 shadow-2xl border border-gray-200 dark:border-[#333] space-y-5 text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Contact {contactReservation.guest?.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{contactReservation.guest?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setContactReservation(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {messageSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-base">Message Sent to Guest!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Your message has been sent to {contactReservation.guest?.email}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#252525] text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-bold">Reservation:</span> {contactReservation.listing?.title} ({formatDate(contactReservation.checkIn)} - {formatDate(contactReservation.checkOut)})
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-gray-500">Your Message</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Type your message for the guest..."
                    className="w-full p-3.5 rounded-2xl border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#181818] text-sm focus:border-black dark:focus:border-white outline-none resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactReservation(null)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383838] text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#252525]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessageSent(true);
                      setTimeout(() => setContactReservation(null), 1800);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-md transition"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ===================================================== */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e1e1e] p-7 shadow-2xl border border-gray-200 dark:border-[#333] space-y-6 text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 text-xs text-red-600 dark:text-red-300 font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-[#383838] bg-gray-50 dark:bg-[#181818] px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-[#383838] bg-gray-50 dark:bg-[#181818] px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-[#383838] font-bold text-xs hover:bg-gray-100 dark:hover:bg-[#252525]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-xs shadow-md disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
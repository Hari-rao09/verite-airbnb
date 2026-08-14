"use client";

import Header from "@/components/layout/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Pencil,
  X,
  Trash2,
  MapPin,
  Star,
} from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { propertiesApi } from "@/lib/api/properties";

interface User {
  id: string;
  name: string;
  email: string;
  is_host?: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myListings, setMyListings] = useState<any[]>([]);

  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  /*
   * Load profile + user's listings
   */
  useEffect(() => {
    const loadProfileAndListings = async () => {
      try {
        // Get logged-in user
        const profile = await authApi.getProfile();

        setUser(profile);

        // Get all listings
        const listings = await propertiesApi.getAll();

        // Only show listings created by this user
        const userListings = listings.filter(
          (listing) =>
            String(listing.hostId) === String(profile.id)
        );

        setMyListings(userListings);
      } catch (error) {
        console.error(
          "Failed to load profile/listings:",
          error
        );
      }
    };

    loadProfileAndListings();
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
      console.error(
        "Failed to update profile:",
        error
      );

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
  const handleDeleteListing = async (
    listingId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(listingId);

      await propertiesApi.delete(listingId);

      setMyListings((currentListings) =>
        currentListings.filter(
          (listing) =>
            String(listing.id) !== String(listingId)
        )
      );

      alert("Listing deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete listing:",
        error
      );

      alert(
        "Failed to delete listing. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Open listing page
   */
  const handleOpenListing = (
    listingId: string
  ) => {
    router.push(`/listing/${listingId}`);
  };

  /*
   * Open edit page
   */
  const handleEditListing = (
    listingId: string
  ) => {
    router.push(`/listing/${listingId}/edit`);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 transition-colors duration-200">

      <Header />

      <div className="pt-[240px] pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">

            {/* ===================================================== */}
            {/* LEFT SIDEBAR */}
            {/* ===================================================== */}

            <aside>

              <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">
                Profile
              </h1>

              <nav className="space-y-2">

                {/* About me */}
                <button
                  type="button"
                  className="
                    w-full
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-xl
                    bg-gray-100
                    dark:bg-[#1e1e1e]
                    text-left
                    font-medium
                    text-gray-900
                    dark:text-white
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-blue-100
                      dark:bg-blue-900/40
                      flex
                      items-center
                      justify-center
                      text-blue-700
                      dark:text-blue-300
                      font-semibold
                    "
                  >
                    {initial}
                  </div>

                  About me
                </button>

                {/* Past trips */}
                <a
                  href="/bookings"
                  className="
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-xl
                    hover:bg-gray-100
                    dark:hover:bg-[#1e1e1e]
                    transition
                    text-gray-800
                    dark:text-gray-200
                  "
                >
                  <span className="text-2xl">
                    🧳
                  </span>

                  <span className="font-medium">
                    Past trips
                  </span>
                </a>

                {/* Connections */}
                <button
                  type="button"
                  className="
                    w-full
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-xl
                    hover:bg-gray-100
                    dark:hover:bg-[#1e1e1e]
                    transition
                    text-left
                    text-gray-800
                    dark:text-gray-200
                  "
                >
                  <span className="text-2xl">
                    🧑‍🤝‍🧑
                  </span>

                  <span className="font-medium">
                    Connections
                  </span>
                </button>

              </nav>

            </aside>


            {/* ===================================================== */}
            {/* RIGHT CONTENT */}
            {/* ===================================================== */}

            <section>

              {/* ================================================= */}
              {/* ABOUT ME */}
              {/* ================================================= */}

              <div className="flex items-center gap-4 mb-8">

                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  About me
                </h2>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-lg
                    bg-gray-100
                    dark:bg-[#1e1e1e]
                    hover:bg-gray-200
                    dark:hover:bg-[#2c2c2c]
                    text-gray-800
                    dark:text-gray-200
                    transition
                    text-sm
                    font-medium
                  "
                >
                  <Pencil className="w-4 h-4" />

                  Edit
                </button>

              </div>


              {/* ================================================= */}
              {/* PROFILE SECTION */}
              {/* ================================================= */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* PROFILE CARD */}
                <div
                  className="
                    border
                    border-gray-200
                    dark:border-[#2a2a2a]
                    bg-white
                    dark:bg-[#1e1e1e]
                    rounded-3xl
                    p-10
                    shadow-sm
                    text-center
                  "
                >

                  <div
                    className="
                      w-28
                      h-28
                      mx-auto
                      rounded-full
                      bg-blue-100
                      dark:bg-blue-900/40
                      flex
                      items-center
                      justify-center
                      text-4xl
                      font-semibold
                      text-blue-700
                      dark:text-blue-300
                    "
                  >
                    {initial}
                  </div>

                  <h3 className="text-3xl font-semibold mt-6 text-gray-900 dark:text-white">
                    {name}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {user?.is_host ? "Host" : "Guest"}
                  </p>

                </div>


                {/* COMPLETE PROFILE */}
                <div className="pt-4">

                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Complete your profile
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mt-4 leading-6">
                    Your Airbnb profile is an important part
                    of every reservation. Create yours to help
                    other hosts and guests get to know you.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-6
                      bg-[#ff385c]
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      font-semibold
                      hover:bg-[#e31c5f]
                      transition
                    "
                  >
                    Get started
                  </button>

                </div>

              </div>


              {/* ================================================= */}
              {/* DIVIDER */}
              {/* ================================================= */}

              <div className="border-t border-gray-200 dark:border-[#2a2a2a] mt-12" />


              {/* ================================================= */}
              {/* YOUR LISTINGS */}
              {/* ================================================= */}

              <div className="border-t border-gray-200 mt-12 pt-10">

                <div className="flex items-center justify-between mb-8">

                  <h2 className="text-3xl font-semibold">
                    Your listings
                  </h2>

                  {myListings.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push("/become-a-host")
                      }
                      className="
                        border
                        border-gray-300
                        px-5
                        py-2.5
                        rounded-xl
                        font-semibold
                        text-sm
                        hover:bg-gray-50
                        transition
                      "
                    >
                      + Add listing
                    </button>
                  )}

                </div>


                {/* ================================================= */}
                {/* NO LISTINGS */}
                {/* ================================================= */}

                {myListings.length === 0 ? (

                  <div
                    className="
                      border
                      border-gray-200
                      rounded-2xl
                      p-10
                      text-center
                    "
                  >

                    <h3 className="text-xl font-semibold">
                      You don't have any listings yet
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Start hosting and your properties will
                      appear here.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        router.push("/become-a-host")
                      }
                      className="
                        mt-5
                        bg-[#FF385C]
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        hover:bg-[#e31c5f]
                        transition
                      "
                    >
                      Create a listing
                    </button>

                  </div>

                ) : (

                  /* ================================================= */
                  /* LISTING GRID */
                  /* ================================================= */

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {myListings.map((listing) => (

                      <div
                        key={listing.id}
                        className="
                          border
                          border-gray-200
                          rounded-2xl
                          overflow-hidden
                          bg-white
                          hover:shadow-lg
                          transition
                        "
                      >

                        {/* ========================================= */}
                        {/* IMAGE */}
                        {/* ========================================= */}

                        <div
                          className="
                            h-56
                            bg-gray-200
                            cursor-pointer
                            overflow-hidden
                          "
                          onClick={() =>
                            handleOpenListing(
                              listing.id
                            )
                          }
                        >

                          <img
                            src={
                              listing.images?.[0] ||
                              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
                            }
                            alt={
                              listing.title ||
                              "Property"
                            }
                            className="
                              w-full
                              h-full
                              object-cover
                              hover:scale-105
                              transition
                              duration-300
                            "
                          />

                        </div>


                        {/* ========================================= */}
                        {/* DETAILS */}
                        {/* ========================================= */}

                        <div className="p-5">

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >

                            <h3
                              className="
                                text-lg
                                font-semibold
                                line-clamp-1
                              "
                            >
                              {listing.title}
                            </h3>

                            <div
                              className="
                                flex
                                items-center
                                gap-1
                                text-sm
                                whitespace-nowrap
                              "
                            >
                              <Star
                                className="
                                  w-4
                                  h-4
                                  fill-black
                                "
                              />

                              5.0
                            </div>

                          </div>


                          {/* LOCATION */}

                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-gray-600
                              mt-3
                              text-sm
                            "
                          >
                            <MapPin
                              className="w-4 h-4"
                            />

                            <span>
                              {listing.city ||
                                listing.address ||
                                "India"}
                              {listing.country
                                ? `, ${listing.country}`
                                : ""}
                            </span>

                          </div>


                          {/* PROPERTY TYPE */}

                          <p
                            className="
                              text-gray-500
                              text-sm
                              mt-2
                              capitalize
                            "
                          >
                            {listing.propertyType ||
                              "Property"}
                          </p>


                          {/* PRICE */}

                          <p className="mt-4">

                            <span className="font-semibold">
                              ₹
                              {Number(
                                listing.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            {" "}night

                          </p>


                          {/* ========================================= */}
                          {/* ACTION BUTTONS */}
                          {/* ========================================= */}

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              mt-5
                              pt-4
                              border-t
                              border-gray-100
                            "
                          >

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditListing(
                                  listing.id
                                )
                              }
                              className="
                                flex-1
                                flex
                                items-center
                                justify-center
                                gap-2
                                border
                                border-gray-300
                                rounded-xl
                                py-2.5
                                text-sm
                                font-semibold
                                text-gray-900
                                hover:bg-gray-50
                                hover:border-gray-400
                                transition
                              "
                            >

                              <Pencil
                                className="w-4 h-4"
                              />

                              Edit

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                String(listing.id)
                              }
                              onClick={() =>
                                handleDeleteListing(
                                  String(listing.id)
                                )
                              }
                              className="
                                flex-1
                                flex
                                items-center
                                justify-center
                                gap-2
                                border
                                border-red-200
                                rounded-xl
                                py-2.5
                                text-sm
                                font-semibold
                                text-red-600
                                hover:bg-red-50
                                hover:border-red-300
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >

                              <Trash2
                                className="w-4 h-4"
                              />

                              {deletingId ===
                              String(listing.id)
                                ? "Deleting..."
                                : "Delete"}

                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>


              {/* ================================================= */}
              {/* REVIEWS */}
              {/* ================================================= */}

              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-4
                  py-8
                  text-lg
                  font-medium
                  hover:text-gray-600
                  transition
                "
              >
                <MessageCircle className="w-6 h-6" />

                Show reviews I've written

              </button>

            </section>

          </div>

        </div>
      </div>


      {/* ===================================================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ===================================================== */}

      {isEditing && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
          onClick={() =>
            setIsEditing(false)
          }
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                mb-6
              "
            >

              <h2 className="text-xl font-semibold">
                Edit profile
              </h2>

              <button
                type="button"
                onClick={() =>
                  setIsEditing(false)
                }
                className="
                  p-2
                  rounded-full
                  hover:bg-gray-100
                  transition
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            {/* ERROR */}

            {error && (

              <div
                className="
                  mb-4
                  rounded-lg
                  bg-red-50
                  border
                  border-red-200
                  p-3
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>

            )}


            {/* FORM */}

            <div className="space-y-4">

              {/* NAME */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    mb-2
                  "
                >
                  Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    focus:border-black
                    focus:ring-1
                    focus:ring-black
                  "
                />

              </div>


              {/* EMAIL */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    mb-2
                  "
                >
                  Email
                </label>

                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) =>
                    setEditEmail(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    focus:border-black
                    focus:ring-1
                    focus:ring-black
                  "
                />

              </div>

            </div>


            {/* MODAL BUTTONS */}

            <div
              className="
                flex
                justify-end
                gap-3
                mt-6
              "
            >

              <button
                type="button"
                onClick={() =>
                  setIsEditing(false)
                }
                className="
                  px-5
                  py-3
                  rounded-lg
                  font-medium
                  hover:bg-gray-100
                  transition
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="
                  px-5
                  py-3
                  rounded-lg
                  bg-[#ff385c]
                  text-white
                  font-semibold
                  hover:bg-[#e31c5f]
                  disabled:opacity-50
                  transition
                "
              >
                {saving
                  ? "Saving..."
                  : "Save"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}
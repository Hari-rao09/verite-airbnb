"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertiesApi } from "@/lib/api/properties";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [beds, setBeds] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const loadListing = async () => {
      try {
        const listing = await propertiesApi.getById(id);

        setTitle(listing.title || "");
        setDescription(listing.description || "");
        setPropertyType(listing.property_type || "");
        setPrice(String(listing.price_per_night || ""));
        setMaxGuests(String(listing.max_guests || ""));
        setBedrooms(String(listing.bedrooms || ""));
        setBeds(String(listing.beds || ""));
        setBathrooms(String(listing.bathrooms || ""));
        setLocation(listing.location || "");
      } catch (error) {
        console.error("Failed to load listing:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await propertiesApi.update(id, {
        title,
        description,
        property_type: propertyType,
        price_per_night: Number(price),
        max_guests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        location,
      });

      alert("Listing updated successfully!");

      router.push("/profile");
    } catch (error) {
      console.error("Failed to update listing:", error);
      alert("Failed to update listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading listing...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24">

      {/* Header */}
      <header className="border-b px-8 py-5 flex items-center justify-between">
        <div className="text-[#FF385C] text-3xl font-bold">
          airbnb
        </div>

        <button
          onClick={() => router.push("/profile")}
          className="border px-5 py-2 rounded-full font-medium hover:bg-gray-100"
        >
          Cancel
        </button>
      </header>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-semibold mb-2">
          Edit your listing
        </h1>

        <p className="text-gray-600 mb-8">
          Update the details of your property.
        </p>

        {/* Title */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Property type */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Property type
          </label>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          >
            <option value="">Select property type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="guesthouse">Guesthouse</option>
            <option value="hotel">Hotel</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Price per night (₹)
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Guests */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Maximum guests
          </label>

          <input
            type="number"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Bedrooms */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Bedrooms
          </label>

          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Beds */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Beds
          </label>

          <input
            type="number"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Bathrooms */}
        <div className="mb-5">
          <label className="block font-medium mb-2">
            Bathrooms
          </label>

          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

        {/* Location */}
        <div className="mb-8">
          <label className="block font-medium mb-2">
            Location
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
          />
        </div>

      </section>

      {/* Bottom save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-8 py-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-8 py-4 rounded-xl font-semibold disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

    </main>
  );
}
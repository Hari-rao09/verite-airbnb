"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export default function BecomeAHostPage() {
  const [address, setAddress] = useState("");
const [showAddressModal, setShowAddressModal] = useState(false);

const [flat, setFlat] = useState("");
const router = useRouter();
const [street, setStreet] = useState("");
const [landmark, setLandmark] = useState("");
const [district, setDistrict] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("Punjab");
const [pinCode, setPinCode] = useState("");

  const handleNext = () => {
  if (!address.trim()) return;

  setShowAddressModal(true);
};

  return (
    <main className="min-h-screen bg-white">

      {/* Airbnb Logo */}
      <header className="px-8 py-6">
        <div className="text-[#FF385C] text-3xl font-bold">
          airbnb
        </div>
      </header>

      {/* Main content */}
      <section className="min-h-[calc(100vh-100px)] flex items-center justify-center px-6">

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left side */}
          <div>

            <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-gray-900">
              Set up your
              <br />
              Airbnb listing
            </h1>

            <p className="text-xl text-gray-600 mt-8 max-w-lg">
              It’s easy to create a great listing – let’s start
              with your address.
            </p>

            {/* Address input */}
            <div className="mt-10">

              <div className="flex items-center border border-gray-400 rounded-full px-5 py-4 max-w-xl focus-within:border-black">

                <Search className="w-5 h-5 text-gray-600 mr-3" />

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="flex-1 outline-none text-lg bg-transparent"
                />

              </div>

            </div>

            {/* Experience / service */}
            <p className="mt-8 text-gray-600">
              Not listing a home?{" "}
              <span className="text-black underline font-medium cursor-pointer">
                Host an experience or service.
              </span>
            </p>

          </div>

          {/* Right side */}
          <div className="flex justify-center">

            <div className="bg-[#f7eef8] rounded-[40px] p-10 w-full max-w-xl">

              <div className="bg-white rounded-3xl overflow-hidden shadow-sm">

                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
                  className="w-full h-[430px] object-cover"
                />

                <div className="p-6">

                  <h2 className="text-2xl font-semibold">
                    Entire home in Dharamshala, Himachal Pradesh
                  </h2>

                  <div className="border-t mt-5 pt-5 flex items-center justify-between">

                    <span className="text-gray-700">
                      Hosted by Vaibhav
                    </span>

                    <div className="w-10 h-10 rounded-full bg-gray-300" />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-8 py-4 flex justify-end">

        <button
          onClick={handleNext}
          disabled={!address.trim()}
          className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold disabled:bg-gray-200 disabled:text-gray-400 transition"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

      {/* Confirm Address Modal */}
{showAddressModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">

        <button
          onClick={() => setShowAddressModal(false)}
          className="text-2xl hover:bg-gray-100 rounded-full w-10 h-10"
        >
          ←
        </button>

        <h2 className="text-xl font-semibold">
          Confirm your address
        </h2>

        <button
          onClick={() => setShowAddressModal(false)}
          className="text-2xl hover:bg-gray-100 rounded-full w-10 h-10"
        >
          ×
        </button>

      </div>

      {/* Form */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">

        {/* Country */}
        <div className="border rounded-xl px-4 py-3 mb-3">
          <label className="text-xs text-gray-500">
            Country/region
          </label>

          <p className="text-base">
            India - IN
          </p>
        </div>

        {/* Flat */}
        <input
          type="text"
          placeholder="Flat, house, etc. (if applicable)"
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 mb-3 outline-none focus:border-black"
        />

        {/* Street */}
        <input
          type="text"
          placeholder="Street address"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 mb-3 outline-none focus:border-black"
        />

        {/* Landmark */}
        <input
          type="text"
          placeholder="Nearby landmark (if applicable)"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 mb-3 outline-none focus:border-black"
        />

        {/* District */}
        <input
          type="text"
          placeholder="District/locality (if applicable)"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 mb-3 outline-none focus:border-black"
        />

        {/* City */}
        <input
          type="text"
          placeholder="City/town"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 mb-3 outline-none focus:border-black"
        />

        {/* State */}
        <input
          type="text"
          placeholder="State/union territory"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 mb-3 outline-none focus:border-black"
        />

        {/* PIN */}
        <input
          type="text"
          placeholder="PIN code"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          maxLength={6}
          className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
        />

      </div>

      {/* Bottom */}
      <div className="border-t p-5">

        <button
          onClick={() => {
            console.log({
              address,
              flat,
              street,
              landmark,
              district,
              city,
              state,
              pinCode,
            });

            setShowAddressModal(false);

sessionStorage.setItem(
  "hostAddress",
  JSON.stringify({
    address,
    flat,
    street,
    landmark,
    district,
    city,
    state,
    pinCode,
  })
);

router.push("/become-a-host/about-your-place");
          }}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800"
        >
          Next
        </button>

      </div>

    </div>

  </div>
)}

    </main>
  );
}
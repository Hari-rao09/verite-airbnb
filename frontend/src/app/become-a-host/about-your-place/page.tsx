"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Building2,
  Warehouse,
  Coffee,
  Ship,
  Trees,
  Car,
  Castle,
  Waves,
  Wifi,
  Snowflake,
  Utensils,
  Tv,
  WashingMachine,
  Thermometer,
  Droplets,
  Refrigerator,
  Upload,
  Plus,
  Minus,
  MapPin,
  X,
} from "lucide-react";

type PropertyType = {
  name: string;
  icon: any;
};

const propertyTypes: PropertyType[] = [
  { name: "House", icon: Home },
  { name: "Flat/apartment", icon: Building2 },
  { name: "Barn", icon: Warehouse },
  { name: "Bed & breakfast", icon: Coffee },
  { name: "Boat", icon: Ship },
  { name: "Cabin", icon: Trees },
  { name: "Campervan/motorhome", icon: Car },
  { name: "Casa particular", icon: Building2 },
  { name: "Castle", icon: Castle },
  { name: "Cave", icon: Warehouse },
  { name: "Container", icon: Warehouse },
  { name: "Cycladic home", icon: Home },
  { name: "Dammuso", icon: Home },
  { name: "Dome", icon: Home },
  { name: "Earth home", icon: Home },
];

const amenities = [
  { name: "Air conditioning", icon: Snowflake },
  { name: "Essentials", icon: Check },
  { name: "Fridge", icon: Refrigerator },
  { name: "Heating", icon: Thermometer },
  { name: "Hot water", icon: Droplets },
  { name: "Kitchen", icon: Utensils },
  { name: "TV", icon: Tv },
  { name: "Washing machine", icon: WashingMachine },
  { name: "Wi-Fi", icon: Wifi },
];

export default function AboutYourPlacePage() {
  const [step, setStep] = useState(1);

  const [propertyType, setPropertyType] = useState("");
  const [privacyType, setPrivacyType] = useState("An entire place");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  useEffect(() => {
  const savedAddress = sessionStorage.getItem("hostAddress");

  if (savedAddress) {
    const data = JSON.parse(savedAddress);

    setCity(data.city || "");
    setState(data.state || "");
    setCountry("India");
  }
}, []);

  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Essentials",
    "Kitchen",
    "Hot water",
    "Wi-Fi",
  ]);

  const [photos, setPhotos] = useState<string[]>([]);

  const [title, setTitle] = useState(
    "Beautiful Mountain Apartment"
  );

  const [description, setDescription] = useState(
    "A comfortable stay."
  );

  const [price, setPrice] = useState(2500);

  const [published, setPublished] = useState(false);

  const totalSteps = 11;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.history.back();
    }
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;

    const urls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setPhotos((current) => [...current, ...urls]);
  };

  const removePhoto = (index: number) => {
    setPhotos((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const canContinue = () => {
  if (step === 1) return true;

  if (step === 2) {
    return propertyType !== "";
  }

  if (step === 3) {
    return privacyType !== "";
  }

  if (step === 4) {
    return city.trim() !== "" && state.trim() !== "";
  }

  if (step === 8) {
    return photos.length >= 1;
  }

  if (step === 9) {
    return title.trim() !== "";
  }

  if (step === 10) {
    return description.trim() !== "";
  }

  if (step === 11) {
    return price > 0;
  }

  return true;
};

  const publishListing = async () => {
  try {
    const savedAddress = sessionStorage.getItem("hostAddress");

    let addressData = {
      city: city,
      state: state,
      country: country,
      location: city,
    };

    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);

      addressData = {
        city: parsedAddress.city || city,
        state: parsedAddress.state || state,
        country: "India",
        location:
          parsedAddress.address ||
          `${parsedAddress.city || city}, ${parsedAddress.state || state}`,
      };
    }

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/listings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        property_type: propertyType,
        price_per_night: price,
        max_guests: guests,
        bedrooms: bedrooms,
        beds: beds,
        bathrooms: bathrooms,
        location: addressData.location,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Create listing failed:", error);
      alert("Failed to create listing. Check the terminal.");
      return;
    }

    const createdListing = await response.json();

    console.log("LISTING CREATED:", createdListing);

    setPublished(true);

  } catch (error) {
    console.error("Publish error:", error);
    alert("Something went wrong while publishing.");
  }
};

  if (published) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-8">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Your listing is published!
          </h1>

          <p className="text-lg text-gray-600 mt-5">
            Your place in {city}, {state} is now ready for guests.
          </p>

          <div className="mt-8 border rounded-2xl p-6 text-left">
            <h2 className="text-xl font-semibold">
              {title}
            </h2>

            <p className="text-gray-600 mt-2">
              {city}, {state}, {country}
            </p>

            <p className="font-semibold mt-4">
              ₹{price.toLocaleString("en-IN")} night
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-8 bg-black text-white px-8 py-4 rounded-xl font-semibold"
          >
            Go to Airbnb
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24">

      {/* HEADER */}
      <header className="px-8 py-6 flex items-center justify-between border-b">
        <div className="text-[#FF385C] text-3xl font-bold">
          airbnb
        </div>

        <button className="border border-gray-300 px-5 py-3 rounded-full font-medium hover:border-black">
          Save & exit
        </button>
      </header>

      {/* PROGRESS */}
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-1 bg-black transition-all duration-300"
          style={{
            width: `${(step / totalSteps) * 100}%`,
          }}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <section className="min-h-[calc(100vh-150px)] flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">

            <div>
              <p className="font-medium text-lg mb-5">
                Step 1
              </p>

              <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
                Tell us about
                <br />
                your place
              </h1>

              <p className="text-xl text-gray-600 mt-8 max-w-xl leading-relaxed">
                In this step, we'll ask you which type of property
                you have and if guests will book the entire place or
                just a room. Then let us know the location and how
                many guests can stay.
              </p>
            </div>

            <div className="flex justify-center">
              <img
                src="/airbnb.jpg"
                alt="Property illustration"
                className="w-full max-w-xl object-contain"
              />
            </div>

          </div>
        </section>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-center mb-12">
            Which of these best describes your place?
          </h1>

          <div className="grid md:grid-cols-3 gap-4">
            {propertyTypes.map((property) => {
              const Icon = property.icon;
              const selected = propertyType === property.name;

              return (
                <button
                  key={property.name}
                  onClick={() => setPropertyType(property.name)}
                  className={`border rounded-2xl p-6 text-left transition ${
                    selected
                      ? "border-black border-2 bg-gray-50"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  <Icon className="w-8 h-8 mb-5" />

                  <span className="font-medium">
                    {property.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-center mb-12">
            What type of place will guests have?
          </h1>

          <div className="space-y-4">
            {[
              {
                title: "An entire place",
                description:
                  "Guests have the whole place to themselves.",
              },
              {
                title: "A room",
                description:
                  "Guests have their own room in a home, plus access to shared spaces.",
              },
              {
                title: "A shared room in a hostel",
                description:
                  "Guests sleep in a shared room in a professionally managed hostel.",
              },
            ].map((option) => {
              const selected = privacyType === option.title;

              return (
                <button
                  key={option.title}
                  onClick={() => setPrivacyType(option.title)}
                  className={`w-full border-2 rounded-2xl p-7 text-left flex items-center justify-between ${
                    selected
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-black"
                  }`}
                >
                  <div>
                    <h2 className="text-xl font-medium">
                      {option.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {option.description}
                    </p>
                  </div>

                  {selected && (
                    <Check className="w-7 h-7" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-center">
            Where's your place located?
          </h1>

          <p className="text-center text-gray-600 mt-4">
            Guests will see the approximate location of your place.
          </p>

          <div className="mt-12 border rounded-3xl overflow-hidden">

            <div className="h-72 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-14 h-14 mx-auto mb-3" />
                <p className="font-medium">
                  {city}, {state}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>

                <input
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  City / town
                </label>

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  State
                </label>

                <input
                  value={state}
                  onChange={(e) =>
                    setState(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-4 outline-none focus:border-black"
                />
              </div>

            </div>
          </div>
        </section>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-center">
            Share some basics about your place
          </h1>

          <p className="text-center text-gray-600 mt-4 mb-12">
            You'll add more details later, such as bed types.
          </p>

          <div className="space-y-0 border-t">

            <Counter
              label="Guests"
              value={guests}
              setValue={setGuests}
              min={1}
              max={16}
            />

            <Counter
              label="Bedrooms"
              value={bedrooms}
              setValue={setBedrooms}
              min={1}
              max={20}
            />

            <Counter
              label="Beds"
              value={beds}
              setValue={setBeds}
              min={1}
              max={30}
            />

            <Counter
              label="Bathrooms"
              value={bathrooms}
              setValue={setBathrooms}
              min={1}
              max={20}
            />

          </div>
        </section>
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <section className="min-h-[calc(100vh-150px)] flex items-center justify-center px-6">
          <div className="max-w-5xl grid md:grid-cols-2 gap-16 items-center">

            <div>
              <p className="font-medium text-lg">
                Step 2
              </p>

              <h1 className="text-5xl md:text-6xl font-semibold mt-5">
                Make your place
                <br />
                stand out
              </h1>

              <p className="text-xl text-gray-600 mt-8 leading-relaxed">
                In this step, you'll add some of the amenities
                your place offers, plus photos. Then you'll create
                a title and description.
              </p>
            </div>

            <img
              src="/airbnb.jpg"
              alt="Your place"
              className="w-full max-w-xl rounded-3xl object-cover"
            />

          </div>
        </section>
      )}

      {/* STEP 7 */}
      {step === 7 && (
        <section className="max-w-4xl mx-auto px-6 py-16">

          <h1 className="text-4xl md:text-5xl font-semibold">
            Tell guests which amenities they'll find at your place
          </h1>

          <p className="text-gray-600 mt-4 mb-10">
            You can add more amenities after you publish your listing.
          </p>

          <div className="grid md:grid-cols-3 gap-4">

            {amenities.map((amenity) => {
              const Icon = amenity.icon;
              const selected =
                selectedAmenities.includes(amenity.name);

              return (
                <button
                  key={amenity.name}
                  onClick={() =>
                    toggleAmenity(amenity.name)
                  }
                  className={`border rounded-2xl p-6 text-left ${
                    selected
                      ? "border-black border-2 bg-gray-50"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  <Icon className="w-7 h-7 mb-5" />

                  <p className="font-medium">
                    {amenity.name}
                  </p>

                  {selected && (
                    <div className="mt-3 text-sm font-medium">
                      ✓ Selected
                    </div>
                  )}
                </button>
              );
            })}

          </div>
        </section>
      )}

      {/* STEP 8 */}
      {step === 8 && (
        <section className="max-w-4xl mx-auto px-6 py-16">

          <h1 className="text-4xl md:text-5xl font-semibold">
            Add some photos of your place
          </h1>

          <p className="text-gray-600 mt-4 mb-10">
            Add photos that show guests what makes your place special.
          </p>

          <label className="border-2 border-dashed border-gray-300 rounded-3xl min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-black">

            <Upload className="w-12 h-12 mb-5" />

            <span className="text-xl font-medium">
              Add photos
            </span>

            <span className="text-gray-500 mt-2">
              JPG, PNG or WEBP
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) =>
                handlePhotos(e.target.files)
              }
            />

          </label>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">

              {photos.map((photo, index) => (
                <div
                  key={photo}
                  className="relative aspect-square"
                >
                  <img
                    src={photo}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  <button
                    onClick={() =>
                      removePhoto(index)
                    }
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

            </div>
          )}

        </section>
      )}

      {/* STEP 9 */}
      {step === 9 && (
        <section className="max-w-3xl mx-auto px-6 py-16">

          <h1 className="text-4xl md:text-5xl font-semibold">
            Now, let's give your place a title
          </h1>

          <p className="text-gray-600 mt-5">
            Short titles work best. Don't worry, you can change it later.
          </p>

          <textarea
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            maxLength={50}
            rows={3}
            className="w-full border-2 border-gray-300 rounded-2xl p-5 mt-10 text-2xl outline-none focus:border-black resize-none"
            placeholder="Beautiful mountain apartment"
          />

          <p className="text-right text-gray-500 mt-2">
            {title.length}/50
          </p>

        </section>
      )}

      {/* STEP 10 */}
      {step === 10 && (
        <section className="max-w-3xl mx-auto px-6 py-16">

          <h1 className="text-4xl md:text-5xl font-semibold">
            Create your description
          </h1>

          <p className="text-gray-600 mt-5">
            Tell guests what makes your place special.
          </p>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={8}
            maxLength={500}
            className="w-full border-2 border-gray-300 rounded-2xl p-5 mt-10 text-lg outline-none focus:border-black resize-none"
            placeholder="Tell guests about your place..."
          />

          <p className="text-right text-gray-500 mt-2">
            {description.length}/500
          </p>

        </section>
      )}

      {/* STEP 11 */}
      {step === 11 && (
        <section className="max-w-5xl mx-auto px-6 py-16">

          <h1 className="text-4xl md:text-5xl font-semibold">
            Set your price
          </h1>

          <p className="text-gray-600 mt-4">
            You can change your price anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-12">

            <div className="border rounded-3xl p-10 text-center">

              <p className="text-gray-600">
                Price per night
              </p>

              <div className="flex items-center justify-center mt-5">
                <span className="text-5xl font-semibold">
                  ₹
                </span>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(Number(e.target.value))
                  }
                  className="text-5xl font-semibold w-48 outline-none text-center"
                />
              </div>

              <p className="text-gray-500 mt-4">
                Guests will pay this amount per night.
              </p>

            </div>

            {/* LISTING PREVIEW */}
            <div className="border rounded-3xl overflow-hidden">

              <img
                src={
                  photos.length > 0
                    ? photos[0]
                    : "/airbnb.jpg"
                }
                alt="Listing preview"
                className="w-full h-56 object-cover"
              />

              <div className="p-6">

                <h2 className="text-xl font-semibold">
                  {title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {city}, {state}
                </p>

                <p className="mt-4 font-semibold">
                  ₹{price.toLocaleString("en-IN")} night
                </p>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 md:px-10 py-4 flex items-center justify-between z-40">

        <button
          onClick={previousStep}
          className="flex items-center gap-2 font-semibold px-5 py-3 rounded-xl hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {step < totalSteps ? (
          <button
            onClick={nextStep}
            disabled={!canContinue()}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold disabled:bg-gray-200 disabled:text-gray-400"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={publishListing}
            disabled={!canContinue()}
            className="flex items-center gap-2 bg-[#FF385C] text-white px-8 py-4 rounded-xl font-semibold disabled:bg-gray-200 disabled:text-gray-400"
          >
            Publish
            <Check className="w-5 h-5" />
          </button>
        )}

      </div>

    </main>
  );
}

/* COUNTER COMPONENT */

function Counter({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between py-7 border-b">

      <span className="text-xl">
        {label}
      </span>

      <div className="flex items-center gap-5">

        <button
          onClick={() =>
            setValue(Math.max(min, value - 1))
          }
          disabled={value <= min}
          className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 hover:border-black"
        >
          <Minus className="w-5 h-5" />
        </button>

        <span className="text-lg w-5 text-center">
          {value}
        </span>

        <button
          onClick={() =>
            setValue(Math.min(max, value + 1))
          }
          disabled={value >= max}
          className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 hover:border-black"
        >
          <Plus className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import SplitMapView, { SplitStay } from "@/components/home/split-map-view";
import {
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  Globe,
  Menu,
  X,
  MapPin,
  CalendarDays,
  Users,
  Plus,
  Minus,
  ArrowRight,
  Map as MapIcon,
  List,
  Tag,
  SlidersHorizontal,
} from "lucide-react";
import FilterModal, { FilterState, initialFilterState } from "@/components/home/filter-modal";

type Stay = {
  id: number;
  title: string;
  location: string;
  country: string;
  type: string;
  guests: number;
  bedrooms: number;
  price: number;
  rating: number;
  image: string;
  favorite?: boolean;
  kind?: "home" | "experience" | "service";
  detail?: string;
};

type Row = {
  title: string;
  subtitle?: string;
  stays: Stay[];
};

/* -------------------------------------------------------
   MOCKED LISTINGS
------------------------------------------------------- */

const mockedStays: Stay[] = [
  {
    id: 1,
    title: "Beautiful home in Noida",
    location: "Noida",
    country: "India",
    type: "Home",
    guests: 4,
    bedrooms: 2,
    price: 2500,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
  },
  {
    id: 2,
    title: "Modern apartment in Noida",
    location: "Noida",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 3200,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },
  {
    id: 3,
    title: "Cozy stay in Noida",
    location: "Noida",
    country: "India",
    type: "House",
    guests: 5,
    bedrooms: 2,
    price: 2800,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
  },
  {
    id: 4,
    title: "Beautiful home in Noida",
    location: "Noida",
    country: "India",
    type: "Villa",
    guests: 6,
    bedrooms: 3,
    price: 4200,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  },
  {
    id: 5,
    title: "Modern apartment in Noida",
    location: "Noida",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 3000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&q=80",
  },

  {
    id: 6,
    title: "Apartment in New Delhi",
    location: "New Delhi",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 3900,
    rating: 4.84,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
  },
  {
    id: 7,
    title: "Flat in Delhi",
    location: "Delhi",
    country: "India",
    type: "Flat",
    guests: 3,
    bedrooms: 1,
    price: 2800,
    rating: 4.88,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
  },
  {
    id: 8,
    title: "Luxury flat in New Delhi",
    location: "New Delhi",
    country: "India",
    type: "Flat",
    guests: 4,
    bedrooms: 2,
    price: 4500,
    rating: 4.93,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  },
  {
    id: 9,
    title: "Flat in New Delhi",
    location: "New Delhi",
    country: "India",
    type: "Flat",
    guests: 5,
    bedrooms: 2,
    price: 4100,
    rating: 4.85,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
  },
  {
    id: 10,
    title: "Apartment in New Delhi",
    location: "New Delhi",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 3900,
    rating: 4.81,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
  },

  {
    id: 11,
    title: "Flat in Bhelupura",
    location: "Varanasi",
    country: "India",
    type: "Flat",
    guests: 3,
    bedrooms: 1,
    price: 2800,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  },
  {
    id: 12,
    title: "Flat in Varanasi",
    location: "Varanasi",
    country: "India",
    type: "Flat",
    guests: 4,
    bedrooms: 2,
    price: 3100,
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
  },
  {
    id: 13,
    title: "Home in Bhelupura",
    location: "Varanasi",
    country: "India",
    type: "Home",
    guests: 5,
    bedrooms: 2,
    price: 4200,
    rating: 4.97,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  },

  {
    id: 14,
    title: "Guest suite in Dehradun",
    location: "Dehradun",
    country: "India",
    type: "Guest suite",
    guests: 3,
    bedrooms: 1,
    price: 3000,
    rating: 4.93,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
  },
  {
    id: 15,
    title: "Flat in Dehradun",
    location: "Dehradun",
    country: "India",
    type: "Flat",
    guests: 4,
    bedrooms: 2,
    price: 3300,
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
  },
  {
    id: 16,
    title: "Villa in Dehradun",
    location: "Dehradun",
    country: "India",
    type: "Villa",
    guests: 6,
    bedrooms: 3,
    price: 5200,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
  },

  {
    id: 17,
    title: "Flat in Gurugram",
    location: "Gurugram",
    country: "India",
    type: "Flat",
    guests: 4,
    bedrooms: 2,
    price: 4500,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?w=1200&q=80",
  },
  {
    id: 18,
    title: "Apartment in Sector 46",
    location: "Gurugram",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 3900,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
  },
  {
    id: 19,
    title: "Home in Gurugram",
    location: "Gurugram",
    country: "India",
    type: "Home",
    guests: 5,
    bedrooms: 3,
    price: 5000,
    rating: 4.94,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
  },

  {
    id: 20,
    title: "Apartment in Mumbai",
    location: "Mumbai",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 5500,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&q=80",
  },
  {
    id: 21,
    title: "Flat in Bandra West",
    location: "Mumbai",
    country: "India",
    type: "Flat",
    guests: 4,
    bedrooms: 2,
    price: 6000,
    rating: 4.85,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },

  {
    id: 22,
    title: "Beautiful mountain apartment",
    location: "Dharamshala",
    country: "India",
    type: "Apartment",
    guests: 4,
    bedrooms: 2,
    price: 2500,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
  },
  {
    id: 23,
    title: "Mountain home in Dharamshala",
    location: "Dharamshala",
    country: "India",
    type: "Home",
    guests: 5,
    bedrooms: 2,
    price: 3200,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
  },
  {
    id: 24,
    title: "Cozy stay in Dharamshala",
    location: "Dharamshala",
    country: "India",
    type: "House",
    guests: 4,
    bedrooms: 2,
    price: 2800,
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  },
];

/* -------------------------------------------------------
   MOCKED EXPERIENCES & SERVICES

   These intentionally use listing id 1 so every card can open
   the already-built booking flow at /listing/1.
------------------------------------------------------- */

const mockedExperiences: Stay[] = [
  {
    id: 1,
    title: "Sunrise yoga by the Ganges",
    location: "Varanasi",
    country: "India",
    type: "Experience",
    guests: 10,
    bedrooms: 0,
    price: 1200,
    rating: 4.96,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
    kind: "experience",
    detail: "Yoga · 2 hours",
  },
  {
    id: 1,
    title: "Street food tour with a local",
    location: "New Delhi",
    country: "India",
    type: "Experience",
    guests: 8,
    bedrooms: 0,
    price: 1800,
    rating: 4.91,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
    kind: "experience",
    detail: "Food tour · 3 hours",
  },
  {
    id: 1,
    title: "Mountain hike & local café",
    location: "Dharamshala",
    country: "India",
    type: "Experience",
    guests: 6,
    bedrooms: 0,
    price: 2200,
    rating: 4.98,
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
    kind: "experience",
    detail: "Hiking · 4 hours",
  },
  {
    id: 1,
    title: "Pottery workshop with an artist",
    location: "Gurugram",
    country: "India",
    type: "Experience",
    guests: 6,
    bedrooms: 0,
    price: 1500,
    rating: 4.94,
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80",
    kind: "experience",
    detail: "Workshop · 2 hours",
  },
  {
    id: 1,
    title: "Mumbai sunset photography walk",
    location: "Mumbai",
    country: "India",
    type: "Experience",
    guests: 5,
    bedrooms: 0,
    price: 2000,
    rating: 4.89,
    image:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&q=80",
    kind: "experience",
    detail: "Photography · 2 hours",
  },
  {
    id: 1,
    title: "Hidden cafés of Noida",
    location: "Noida",
    country: "India",
    type: "Experience",
    guests: 6,
    bedrooms: 0,
    price: 1400,
    rating: 4.92,
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    kind: "experience",
    detail: "Food & drink · 2 hours",
  },
];

const mockedServices: Stay[] = [
  {
    id: 1,
    title: "Professional home photography",
    location: "Gurugram",
    country: "India",
    type: "Service",
    guests: 1,
    bedrooms: 0,
    price: 3500,
    rating: 4.97,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
    kind: "service",
    detail: "Photography",
  },
  {
    id: 1,
    title: "Private chef for your stay",
    location: "New Delhi",
    country: "India",
    type: "Service",
    guests: 8,
    bedrooms: 0,
    price: 4500,
    rating: 4.95,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
    kind: "service",
    detail: "Private chef",
  },
  {
    id: 1,
    title: "Relaxing massage at home",
    location: "Noida",
    country: "India",
    type: "Service",
    guests: 2,
    bedrooms: 0,
    price: 2500,
    rating: 4.93,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80",
    kind: "service",
    detail: "Wellness",
  },
  {
    id: 1,
    title: "Personal trainer for your stay",
    location: "Gurugram",
    country: "India",
    type: "Service",
    guests: 2,
    bedrooms: 0,
    price: 1800,
    rating: 4.91,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    kind: "service",
    detail: "Fitness",
  },
  {
    id: 1,
    title: "Hair & makeup at your accommodation",
    location: "Mumbai",
    country: "India",
    type: "Service",
    guests: 2,
    bedrooms: 0,
    price: 3000,
    rating: 4.96,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80",
    kind: "service",
    detail: "Beauty",
  },
  {
    id: 1,
    title: "Airport transfer with a private car",
    location: "New Delhi",
    country: "India",
    type: "Service",
    guests: 4,
    bedrooms: 0,
    price: 1600,
    rating: 4.90,
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
    kind: "service",
    detail: "Transport",
  },
];

const experienceRows: Row[] = [
  {
    title: "Popular experiences",
    subtitle: "Things to do hosted by local people",
    stays: mockedExperiences,
  },
  {
    title: "Experiences in Varanasi",
    stays: mockedExperiences.filter((item) => item.location === "Varanasi"),
  },
  {
    title: "Experiences in Delhi NCR",
    stays: mockedExperiences.filter(
      (item) =>
        item.location === "New Delhi" ||
        item.location === "Noida" ||
        item.location === "Gurugram"
    ),
  },
  {
    title: "Mountain experiences",
    stays: mockedExperiences.filter(
      (item) => item.location === "Dharamshala"
    ),
  },
];

const serviceRows: Row[] = [
  {
    title: "Popular services",
    subtitle: "Book trusted services for your stay",
    stays: mockedServices,
  },
  {
    title: "Services in Delhi NCR",
    stays: mockedServices.filter(
      (item) =>
        item.location === "New Delhi" ||
        item.location === "Noida" ||
        item.location === "Gurugram"
    ),
  },
  {
    title: "Wellness & beauty",
    stays: mockedServices.filter(
      (item) =>
        item.detail === "Wellness" ||
        item.detail === "Fitness" ||
        item.detail === "Beauty"
    ),
  },
];

/* -------------------------------------------------------
   HOMEPAGE ROWS
------------------------------------------------------- */

const rows: Row[] = [
  {
    title: "Popular homes in Noida",
    stays: mockedStays.filter((stay) => stay.location === "Noida"),
  },
  {
    title: "Available in New Delhi this weekend",
    stays: mockedStays.filter(
      (stay) =>
        stay.location === "New Delhi" || stay.location === "Delhi"
    ),
  },
  {
    title: "Stay in Varanasi",
    stays: mockedStays.filter(
      (stay) => stay.location === "Varanasi"
    ),
  },
  {
    title: "Available in Dehradun this weekend",
    stays: mockedStays.filter(
      (stay) => stay.location === "Dehradun"
    ),
  },
  {
    title: "Homes in Gurugram District",
    stays: mockedStays.filter(
      (stay) => stay.location === "Gurugram"
    ),
  },
  {
    title: "Check out homes in Mumbai",
    stays: mockedStays.filter(
      (stay) => stay.location === "Mumbai"
    ),
  },
  {
    title: "Beautiful stays in Dharamshala",
    stays: mockedStays.filter(
      (stay) => stay.location === "Dharamshala"
    ),
  },
];

const filters = [
  {
    name: "Popular",
    icon: "✨",
  },
  {
    name: "Arts & culture",
    icon: "🎨",
  },
  {
    name: "Mountains",
    icon: "🏔️",
  },
  {
    name: "Beach",
    icon: "🏖️",
  },
  {
    name: "Amazing views",
    icon: "🌄",
  },
];

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

export default function HomePage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("Homes");
  const [selectedFilter, setSelectedFilter] = useState("Popular");

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchLocation, setSearchLocation] = useState("");
  const [searchDates, setSearchDates] = useState("");
  const [guests, setGuests] = useState(0);

  const [activeSearch, setActiveSearch] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageTab, setLanguageTab] = useState<"language" | "currency">("language");
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedRegion, setSelectedRegion] = useState("India");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const [promoMounted, setPromoMounted] = useState(true);
  const [promoVisible, setPromoVisible] = useState(false);
  const [showMapSplit, setShowMapSplit] = useState(false);

  // Home Interactive Filter Modal State
  const [isHomeFilterModalOpen, setIsHomeFilterModalOpen] = useState(false);
  const [homeFilters, setHomeFilters] = useState<FilterState>(initialFilterState);

  useEffect(() => {
    // Smooth entrance transition from bottom to center on page land
    const timer = setTimeout(() => {
      setPromoVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const closePromo = () => {
    // Smooth exit transition from center to bottom
    setPromoVisible(false);
    setTimeout(() => {
      setPromoMounted(false);
    }, 400);
  };

  const [favorites, setFavorites] = useState<number[]>([]);

  const splitMapStays: SplitStay[] = useMemo(() => {
    return [
      {
        id: 1,
        title: "Flat in Noida",
        headline: "Premium 2BHK Airbnb Noida | Party | Relax & Chill",
        propertyType: "Flat",
        location: "Noida",
        country: "India",
        guests: 5,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        price: 4250,
        originalPrice: 8500,
        rating: 4.76,
        reviewCount: 17,
        dates: "28–30 Aug",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
        ],
        lat: 28.5355,
        lng: 77.391,
        isGuestFavorite: true,
        isPinned: true,
      },
      {
        id: 2,
        title: "Flat in Noida",
        propertyType: "Flat",
        location: "Noida",
        country: "India",
        guests: 4,
        bedrooms: 2,
        price: 2500,
        rating: 4.2,
        reviewCount: 5,
        image:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
        lat: 28.567,
        lng: 77.321,
      },
      {
        id: 3,
        title: "Loft in Noida",
        propertyType: "Loft",
        location: "Noida",
        country: "India",
        guests: 3,
        bedrooms: 1,
        price: 3000,
        rating: 4.8,
        reviewCount: 5,
        image:
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        lat: 28.582,
        lng: 77.335,
      },
      {
        id: 4,
        title: "Modern Apartment in Noida",
        propertyType: "Apartment",
        location: "Noida",
        country: "India",
        guests: 4,
        bedrooms: 2,
        price: 5532,
        rating: 4.9,
        reviewCount: 14,
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        lat: 28.541,
        lng: 77.402,
      },
      {
        id: 5,
        title: "Luxury Villa in Greater Noida",
        propertyType: "Villa",
        location: "Noida",
        country: "India",
        guests: 8,
        bedrooms: 4,
        price: 13170,
        rating: 4.95,
        reviewCount: 22,
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        lat: 28.474,
        lng: 77.503,
      },
      {
        id: 6,
        title: "Penthouse Suite Noida",
        propertyType: "Penthouse",
        location: "Noida",
        country: "India",
        guests: 6,
        bedrooms: 3,
        price: 10168,
        rating: 4.88,
        reviewCount: 9,
        image:
          "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        lat: 28.512,
        lng: 77.378,
      },
      {
        id: 7,
        title: "Executive Flat Sector 62",
        propertyType: "Flat",
        location: "Noida",
        country: "India",
        guests: 4,
        bedrooms: 2,
        price: 7500,
        rating: 4.82,
        reviewCount: 11,
        image:
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
        lat: 28.625,
        lng: 77.368,
      },
      {
        id: 8,
        title: "Grand Residency Indirapuram",
        propertyType: "Apartment",
        location: "Noida",
        country: "India",
        guests: 5,
        bedrooms: 3,
        price: 11709,
        rating: 4.91,
        reviewCount: 18,
        image:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        lat: 28.641,
        lng: 77.382,
      },
    ];
  }, []);

  /* -----------------------------------------------------
     SEARCH
  ----------------------------------------------------- */

  const performSearch = () => {
    const location = searchLocation.trim();

    setActiveSearch(location);

    setSearchOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearSearch = () => {
    setSearchLocation("");
    setActiveSearch("");
    setSearchDates("");
    setGuests(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* -----------------------------------------------------
     FILTERED RESULTS
  ----------------------------------------------------- */

  const filteredRows = useMemo(() => {
    if (!activeSearch) {
      return rows;
    }

    const query = activeSearch.toLowerCase();

    const matchingStays = mockedStays.filter((stay) => {
      return (
        stay.location.toLowerCase().includes(query) ||
        stay.country.toLowerCase().includes(query) ||
        stay.title.toLowerCase().includes(query) ||
        stay.type.toLowerCase().includes(query)
      );
    });

    if (matchingStays.length === 0) {
      return [];
    }

    return [
      {
        title: `Stays in ${activeSearch}`,
        subtitle: `${matchingStays.length} stays available`,
        stays: matchingStays,
      },
    ];
  }, [activeSearch]);

  /* -----------------------------------------------------
     CATEGORY FILTER
  ----------------------------------------------------- */

  const categoryFilteredRows =
    selectedCategory === "Experiences"
      ? experienceRows
      : selectedCategory === "Services"
        ? serviceRows
        : filteredRows;

  // Filter rows dynamically using homeFilters
  const finalFilteredRows = useMemo(() => {
    return categoryFilteredRows
      .map((row) => ({
        ...row,
        stays: row.stays.filter((stay) => {
          if (stay.price < homeFilters.minPrice || stay.price > homeFilters.maxPrice) return false;
          if (homeFilters.bedrooms > 0 && stay.bedrooms < homeFilters.bedrooms) return false;
          if (homeFilters.propertyTypes.length > 0) {
            const match = homeFilters.propertyTypes.some((t) =>
              stay.type?.toLowerCase().includes(t.toLowerCase()) ||
              stay.title?.toLowerCase().includes(t.toLowerCase())
            );
            if (!match) return false;
          }
          return true;
        }),
      }))
      .filter((row) => row.stays.length > 0);
  }, [categoryFilteredRows, homeFilters]);

  // Active filter count for Home Page
  const activeHomeFilterCount = useMemo(() => {
    let count = 0;
    if (homeFilters.minPrice > 1000 || homeFilters.maxPrice < 50000) count++;
    if (homeFilters.placeType !== "ANY") count++;
    if (homeFilters.propertyTypes.length > 0) count += homeFilters.propertyTypes.length;
    if (homeFilters.bedrooms > 0) count++;
    if (homeFilters.beds > 0) count++;
    if (homeFilters.bathrooms > 0) count++;
    if (homeFilters.amenities.length > 0) count += homeFilters.amenities.length;
    if (homeFilters.instantBook) count++;
    if (homeFilters.selfCheckIn) count++;
    return count;
  }, [homeFilters]);

  /* -----------------------------------------------------
     FAVORITES
  ----------------------------------------------------- */

  const toggleFavorite = (
    event: React.MouseEvent,
    id: number
  ) => {
    event.stopPropagation();

    setFavorites((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  /* -----------------------------------------------------
     ROW SCROLL
  ----------------------------------------------------- */

  const scrollRow = (
    rowIndex: number,
    direction: "left" | "right"
  ) => {
    const element = document.getElementById(
      `listing-row-${rowIndex}`
    );

    if (!element) return;

    const amount = direction === "left" ? -800 : 800;

    element.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  /* -----------------------------------------------------
     OPEN LISTING
  ----------------------------------------------------- */

  const openListing = (id: number) => {
    router.push(`/listing/${id}`);
  };

  /* -----------------------------------------------------
     CLOSE MENU WHEN CLICKING OUTSIDE
  ----------------------------------------------------- */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setLanguageOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] text-[#222222] dark:text-gray-100 transition-colors duration-200">

      {/* ==================================================
          HEADER
      ================================================== */}
      <Header
        activeTab={selectedCategory}
        onTabChange={(tab) => {
          setSelectedCategory(tab);
          setActiveSearch("");
          setSearchLocation("");
          setSearchDates("");
          setGuests(0);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ==================================================
          PROMOTIONAL POPUP WITH FLUID BOTTOM-TO-CENTER ANIMATION
      ================================================== */}

      {promoMounted && (
        <div
          onClick={closePromo}
          className={`fixed inset-0 z-[90] flex items-center justify-center px-4 airbnb-backdrop-fade ${
            promoVisible
              ? "bg-black/40 dark:bg-black/70 backdrop-blur-md opacity-100"
              : "bg-transparent backdrop-blur-none opacity-0 pointer-events-none"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-[#1e1e1e] rounded-[32px] shadow-2xl border border-gray-100 dark:border-[#333333] max-w-[420px] w-full p-8 relative text-gray-900 dark:text-gray-100 airbnb-modal-spring will-change-transform ${
              promoVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-28 scale-90 opacity-0"
            }`}
          >
            <button
              onClick={closePromo}
              className="absolute right-5 top-5 w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-[#FFF3EE] dark:bg-[#2a1d17] border border-[#FFE0B2]/60 dark:border-[#5a3a2a] flex items-center justify-center shadow-inner">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.5 8.5L8.5 21.5L26.5 39.5L39.5 26.5L21.5 8.5Z"
                    fill="#FFA500"
                    stroke="#FF7A00"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="3.5"
                    fill="#E65100"
                    stroke="#FFE0B2"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
              One simple price
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-center mt-2.5 leading-relaxed text-sm">
              See one price for your trip, with all fees included.
            </p>

            <button
              onClick={closePromo}
              className="mt-7 w-full bg-[#222222] dark:bg-white text-white dark:text-black py-3.5 rounded-2xl font-bold text-base hover:bg-black dark:hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.98] transition duration-200 shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="px-6 lg:px-12 pt-[220px]">

        <div className="max-w-[1500px] mx-auto">

          {/* FILTER PILLS + FILTERS MODAL BUTTON */}

          <div className="flex items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() =>
                    setSelectedFilter(filter.name)
                  }
                  className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-full border transition ${
                    selectedFilter === filter.name
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                      : "border-gray-300 dark:border-[#333333] bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white"
                  }`}
                >
                  <span>
                    {filter.icon}
                  </span>

                  <span className="text-sm font-medium">
                    {filter.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsHomeFilterModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-xs font-bold transition shadow-sm shrink-0 ${
                activeHomeFilterCount > 0
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white ring-2 ring-black/10"
                  : "border-gray-300 dark:border-[#333333] text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white bg-white dark:bg-[#1e1e1e]"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeHomeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
                  {activeHomeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* ACTIVE SEARCH */}

          {activeSearch && (
            <div className="mt-10 flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Search results
                </p>

                <h1 className="text-3xl font-bold mt-1">
                  Stays in {activeSearch}
                </h1>

              </div>

              <button
                onClick={clearSearch}
                className="px-5 py-3 rounded-full border border-gray-300 font-semibold text-sm hover:border-black"
              >
                Clear search
              </button>

            </div>
          )}

          {/* ==================================================
              MAIN LISTINGS CONTENT (SPLIT MAP OR ROWS)
          ================================================== */}

          {showMapSplit || activeSearch ? (
            <div className="mt-8">
              <SplitMapView
                locationName={activeSearch || "Noida"}
                stays={splitMapStays}
                onBackToGrid={() => {
                  setShowMapSplit(false);
                  clearSearch();
                }}
              />
            </div>
          ) : (
            <div className="mt-10">

              {finalFilteredRows.length === 0 ? (

                /* NO RESULTS */

                <div className="min-h-[420px] flex flex-col items-center justify-center text-center">

                  <div className="text-6xl mb-6">
                    🏠
                  </div>

                  <h2 className="text-2xl font-bold">
                    No stays found
                  </h2>

                  <p className="text-gray-500 mt-2 max-w-md">
                    We couldn't find any stays
                    matching your current filters.
                  </p>

                  <button
                    onClick={() => {
                      clearSearch();
                      setHomeFilters(initialFilterState);
                    }}
                    className="mt-6 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold"
                  >
                    Clear all filters
                  </button>

                </div>

              ) : (

                finalFilteredRows.map(
                  (row, rowIndex) => {

                    if (
                      row.stays.length === 0
                    ) {
                      return null;
                    }

                    return (
                      <section
                        key={row.title}
                        className="mb-14"
                      >

                        {/* ROW HEADER */}

                        <div className="flex items-center justify-between mb-5">

                          <div>

                            <h2
                              onClick={() => setShowMapSplit(true)}
                              className="text-2xl font-bold hover:underline cursor-pointer flex items-center gap-2 group"
                            >
                              {row.title}
                              <span className="text-sm font-normal text-gray-500 group-hover:text-black dark:group-hover:text-white">
                                ›
                              </span>
                            </h2>

                            {row.subtitle && (
                              <p className="text-gray-500 mt-1">
                                {row.subtitle}
                              </p>
                            )}

                          </div>

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                scrollRow(
                                  rowIndex,
                                  "left"
                                )
                              }
                              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 flex items-center justify-center hover:border-black dark:hover:border-white hover:shadow-sm transition"
                            >
                              <ChevronLeft
                                size={18}
                              />
                            </button>

                            <button
                              onClick={() =>
                                scrollRow(
                                  rowIndex,
                                  "right"
                                )
                              }
                              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 flex items-center justify-center hover:border-black dark:hover:border-white hover:shadow-sm transition"
                            >
                              <ChevronRight
                                size={18}
                              />
                            </button>

                          </div>

                        </div>

                        {/* LISTINGS */}

                        <div
                          id={`listing-row-${rowIndex}`}
                          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
                        >

                          {row.stays.map(
                            (stay) => {

                              const isFavorite =
                                favorites.includes(
                                  stay.id
                                );

                              return (
                                <article
                                  key={stay.id}
                                  onClick={() =>
                                    openListing(
                                      stay.id
                                    )
                                  }
                                  className="group w-[245px] sm:w-[270px] md:w-[285px] min-w-[245px] sm:min-w-[270px] md:min-w-[285px] flex-none cursor-pointer"
                                >

                                  {/* IMAGE */}

                                  <div className="relative aspect-[1/1.02] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#222222]">

                                    <img
                                      src={stay.image}
                                      alt={
                                        stay.title
                                      }
                                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                                    />

                                    {/* CATEGORY / GUEST BADGE */}

                                    {stay.kind === "experience" && (
                                      <div className="absolute left-3 top-3 bg-white/95 dark:bg-[#1e1e1e]/95 text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-gray-100 dark:border-[#333333]">
                                        Experience
                                      </div>
                                    )}

                                    {stay.kind === "service" && (
                                      <div className="absolute left-3 top-3 bg-white/95 dark:bg-[#1e1e1e]/95 text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-gray-100 dark:border-[#333333]">
                                        Service
                                      </div>
                                    )}

                                    {!stay.kind && stay.rating >= 4.9 && (
                                      <div className="absolute left-3 top-3 bg-white/95 dark:bg-[#1e1e1e]/95 text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-gray-100 dark:border-[#333333]">
                                        Guest favourite
                                      </div>
                                    )}

                                    {/* HEART */}

                                    <button
                                      onClick={(
                                        event
                                      ) =>
                                        toggleFavorite(
                                          event,
                                          stay.id
                                        )
                                      }
                                      className="absolute right-3 top-3 w-9 h-9 flex items-center justify-center"
                                    >
                                      <Heart
                                        size={25}
                                        className={`${
                                          isFavorite
                                            ? "fill-[#FF385C] text-[#FF385C]"
                                            : "text-white"
                                        } drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]`}
                                      />
                                    </button>

                                  </div>

                                  {/* DETAILS */}

                                  <div className="mt-3">

                                    <div className="flex justify-between gap-3">

                                      <h3 className="font-semibold truncate text-gray-900 dark:text-white">
                                        {stay.title}
                                      </h3>

                                      <span className="flex items-center gap-1 text-sm shrink-0 text-gray-900 dark:text-gray-200">
                                        <span>
                                          ★
                                        </span>

                                        {stay.rating.toFixed(
                                          2
                                        )}
                                      </span>

                                    </div>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                      {stay.location},{" "}
                                      {stay.country}
                                    </p>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                      {stay.kind === "experience" ||
                                      stay.kind === "service"
                                        ? stay.detail
                                        : `${stay.bedrooms} bedrooms · ${stay.guests} guests`}
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                                      ₹
                                      {stay.price.toLocaleString("en-IN")}{" "}
                                      <span className="font-normal text-gray-600 dark:text-gray-400">
                                        {stay.kind === "experience"
                                          ? "per person"
                                          : stay.kind === "service"
                                            ? "starting"
                                            : "night"}
                                      </span>
                                    </p>

                                  </div>

                                </article>
                              );
                            }
                          )}

                        </div>

                      </section>
                    );
                  }
                )

              )}

            </div>
          )}

        </div>

      </section>

      {/* ==================================================
          FLOATING "SHOW MAP" / "SHOW LIST" BUTTON
      ================================================== */}

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowMapSplit(!showMapSplit)}
          className="bg-[#222222] dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-full font-bold text-sm shadow-2xl hover:scale-105 active:scale-95 transition duration-200 flex items-center gap-2 border border-white/20 dark:border-black/20"
        >
          {showMapSplit ? (
            <>
              <span>Show list</span>
              <List size={16} />
            </>
          ) : (
            <>
              <span>Show map</span>
              <MapIcon size={16} />
            </>
          )}
        </button>
      </div>

      {/* ==================================================
          EXPLORE ALL
      ================================================== */}

      {!activeSearch && !showMapSplit && (
        <section className="px-6 lg:px-12 py-16 border-t border-gray-200 dark:border-[#2a2a2a]">

          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore stays made for you
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">
                Find your next stay
              </h2>

            </div>

            <button
              onClick={() =>
                setSearchOpen(true)
              }
              className="flex items-center gap-2 font-semibold hover:underline text-gray-900 dark:text-white"
            >
              Explore all
              <ArrowRight size={18} />
            </button>

          </div>

        </section>
      )}

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="bg-[#f7f7f7] dark:bg-[#181818] border-t border-gray-200 dark:border-[#2a2a2a] px-6 lg:px-12 py-12 mt-8 text-gray-800 dark:text-gray-200">

        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>

            <h3 className="font-semibold mb-5 text-gray-900 dark:text-white">
              Support
            </h3>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">

              <button className="block hover:underline">
                Help Centre
              </button>

              <button className="block hover:underline">
                Safety information
              </button>

              <button className="block hover:underline">
                Cancellation options
              </button>

              <button className="block hover:underline">
                Accessibility
              </button>

            </div>

          </div>

          <div>

            <h3 className="font-semibold mb-5 text-gray-900 dark:text-white">
              Hosting
            </h3>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">

              <button
                onClick={() =>
                  router.push(
                    "/become-a-host"
                  )
                }
                className="block hover:underline"
              >
                Airbnb your home
              </button>

              <button className="block hover:underline">
                Hosting resources
              </button>

              <button className="block hover:underline">
                Hosting responsibly
              </button>

              <button className="block hover:underline">
                Community forum
              </button>

            </div>

          </div>

          <div>

            <h3 className="font-semibold mb-5 text-gray-900 dark:text-white">
              Airbnb
            </h3>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">

              <button className="block hover:underline">
                2026 Summer Release
              </button>

              <button className="block hover:underline">
                Newsroom
              </button>

              <button className="block hover:underline">
                Careers
              </button>

              <button className="block hover:underline">
                Investors
              </button>

            </div>

          </div>

        </div>

        <div className="max-w-[1500px] mx-auto border-t border-gray-300 dark:border-[#333333] mt-10 pt-7 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">

          <p>
            © 2026 AirClone · Privacy · Terms
          </p>

          <div className="flex items-center gap-5">

            <span>₹ INR</span>

            <span>●</span>

            <span>𝕏</span>

            <span>◎</span>

          </div>

        </div>

      </footer>

      {/* HOME PAGE FILTER MODAL */}
      <FilterModal
        isOpen={isHomeFilterModalOpen}
        onClose={() => setIsHomeFilterModalOpen(false)}
        onApply={(newFilters) => setHomeFilters(newFilters)}
        currentFilters={homeFilters}
      />

    </main>
  );
}
export interface DetailedListing {
  id: number | string;
  title: string;
  subtitle: string;
  propertyType: string;
  location: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  originalPricePerNight?: number;
  rating: number;
  reviewCount: number;
  isGuestFavorite: boolean;
  isSuperhost?: boolean;
  images: string[];
  highlights: {
    icon: string;
    title: string;
    description: string;
  }[];
  description: {
    intro: string;
    space: string[];
  };
  bedroomsDetail: {
    name: string;
    bedType: string;
    image: string;
  }[];
  amenities: {
    category: string;
    items: {
      name: string;
      icon: string;
      available: boolean;
    }[];
  }[];
  ratingsBreakdown: {
    overall: number;
    cleanliness: number;
    accuracy: number;
    checkIn: number;
    communication: number;
    location: number;
    value: number;
    distribution: { stars: number; percentage: number }[];
    tagPills: { name: string; count: number }[];
  };
  reviews: {
    id: string;
    authorName: string;
    authorAvatar: string;
    tenure: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    joinedDate: string;
    responseRate: string;
    responseTime: string;
    bio: string;
  };
}

export const detailedListingsData: Record<string, DetailedListing> = {
  "1": {
    id: "1",
    title: "Premium 2BHK Airbnb Noida | Party | Relax & Chill",
    subtitle: "Entire rental unit in Noida, India",
    propertyType: "Flat",
    location: "Noida",
    city: "Noida",
    country: "India",
    lat: 28.5355,
    lng: 77.391,
    guests: 5,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    pricePerNight: 4250,
    originalPricePerNight: 8500,
    rating: 4.76,
    reviewCount: 17,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    ],
    highlights: [
      {
        icon: "🏆",
        title: "Top 5% of homes",
        description: "This home is highly ranked based on ratings, reviews and reliability.",
      },
      {
        icon: "❄️",
        title: "Designed for staying cool",
        description: "Beat the heat with high-capacity A/C and ceiling fans in every room.",
      },
      {
        icon: "🚪",
        title: "Self check-in",
        description: "You can check in seamlessly with the 24/7 building front desk staff.",
      },
    ],
    description: {
      intro:
        "Introducing a charming 2 BHK property located in the heart of Noida. This well-designed residence offers a perfect blend of comfort and functionality. Our property is a wonderful opportunity for those seeking a stylish and convenient home away from home.",
      space: [
        "Fully functional modern kitchen with dining space",
        "2 bright and Cozy Bedrooms along with Attached Bathrooms",
        "Dedicated Smoking & Chill Zone with Balcony",
        "High-Speed Optical Fiber Internet (300 Mbps) & 55-inch 4K Smart TV",
        "Power backup 24x7 with secure gated community",
      ],
    },
    bedroomsDetail: [
      {
        name: "Bedroom 1",
        bedType: "1 queen bed",
        image:
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
      },
      {
        name: "Bedroom 2",
        bedType: "1 double bed",
        image:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      },
      {
        name: "Living Room",
        bedType: "1 sofa bed",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      },
    ],
    amenities: [
      {
        category: "Scenic views",
        items: [
          { name: "City skyline view", icon: "🏙️", available: true },
          { name: "Garden view", icon: "🪴", available: true },
        ],
      },
      {
        category: "Bathroom",
        items: [
          { name: "Hairdryer", icon: "💨", available: true },
          { name: "Cleaning products", icon: "🧼", available: true },
          { name: "Shampoo & Body soap", icon: "🧴", available: true },
          { name: "Hot water 24/7", icon: "🚿", available: true },
        ],
      },
      {
        category: "Bedroom and laundry",
        items: [
          { name: "Washing machine", icon: "🧺", available: true },
          { name: "Essentials (Towels, bed sheets, soap)", icon: "🛏️", available: true },
          { name: "Hangers & Iron", icon: "👔", available: true },
          { name: "Extra pillows and blankets", icon: "🛌", available: true },
        ],
      },
      {
        category: "Entertainment",
        items: [
          { name: "55-inch 4K Smart TV with Netflix", icon: "📺", available: true },
          { name: "Bluetooth Sound System", icon: "🔊", available: true },
          { name: "Board games (Jenga, Uno, Cards)", icon: "🎲", available: true },
        ],
      },
      {
        category: "Heating and cooling",
        items: [
          { name: "Split Air conditioning", icon: "❄️", available: true },
          { name: "Ceiling fans", icon: "🌀", available: true },
          { name: "Room heater", icon: "🔥", available: true },
        ],
      },
      {
        category: "Home safety",
        items: [
          { name: "Smoke alarm", icon: "🔔", available: true },
          { name: "Carbon monoxide alarm", icon: "🔕", available: true },
          { name: "First aid kit", icon: "🩹", available: true },
          { name: "Fire extinguisher", icon: "🧯", available: true },
        ],
      },
      {
        category: "Internet and office",
        items: [
          { name: "High-speed Wifi (300 Mbps)", icon: "📶", available: true },
          { name: "Dedicated workspace with ergonomic chair", icon: "💻", available: true },
        ],
      },
      {
        category: "Kitchen and dining",
        items: [
          { name: "Fully equipped Kitchen", icon: "🍳", available: true },
          { name: "Microwave & Refrigerator", icon: "🧊", available: true },
          { name: "Cooking basics (Pots, pans, oil, salt)", icon: "🧂", available: true },
          { name: "Dishes and silverware", icon: "🍽️", available: true },
          { name: "Electric kettle & Toaster", icon: "☕", available: true },
        ],
      },
      {
        category: "Location features",
        items: [
          { name: "Private entrance", icon: "🚪", available: true },
          { name: "Free on-street parking", icon: "🚗", available: true },
          { name: "Elevator access", icon: "🛗", available: true },
        ],
      },
    ],
    ratingsBreakdown: {
      overall: 4.76,
      cleanliness: 4.7,
      accuracy: 4.8,
      checkIn: 4.7,
      communication: 4.7,
      location: 4.7,
      value: 4.7,
      distribution: [
        { stars: 5, percentage: 88 },
        { stars: 4, percentage: 10 },
        { stars: 3, percentage: 2 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ],
      tagPills: [
        { name: "Comfort", count: 4 },
        { name: "Accuracy", count: 2 },
        { name: "Cleanliness", count: 3 },
        { name: "Hospitality", count: 5 },
        { name: "Location", count: 2 },
      ],
    },
    reviews: [
      {
        id: "r1",
        authorName: "Pankaj",
        authorAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        tenure: "2 years on Airbnb",
        date: "4 days ago",
        rating: 5,
        comment:
          "Had a great stay at this Airbnb. The place was clean, comfortable, and exactly as described. The host was friendly, responsive, and helpful throughout the stay. The location was very convenient with easy access to metro and cafes.",
      },
      {
        id: "r2",
        authorName: "Scientist",
        authorAvatar:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        tenure: "8 months on Airbnb",
        date: "5 days ago",
        rating: 5,
        comment:
          "First of all, this review is not generated by AI! I had an amazing birthday party here, best place for normal get together and house party (specially it's very spacious and has great ambiance). Would 100% visit again.",
      },
      {
        id: "r3",
        authorName: "Gaurav",
        authorAvatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
        tenure: "2 years on Airbnb",
        date: "6 days ago",
        rating: 5,
        comment:
          "Superb 2BHK flat in Noida. Kitchen is equipped with all necessities, high speed wifi was perfect for my remote work, and check-in was hassle-free. 10/10 experience!",
      },
      {
        id: "r4",
        authorName: "Avijit",
        authorAvatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80",
        tenure: "1 year on Airbnb",
        date: "1 week ago",
        rating: 5,
        comment:
          "The property was sparkling clean, well decorated, and the host was very polite. Will definitely book again whenever I visit Noida or Delhi.",
      },
    ],
    host: {
      name: "Vaibhav",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      isSuperhost: true,
      joinedDate: "Joined in March 2022",
      responseRate: "100%",
      responseTime: "within an hour",
      bio: "Passionate about travel, interior architecture, and creating unforgettable homestays for travelers from all around the world.",
    },
  },
};

// Fallback generator for other listings
export function getDetailedListingById(id: string | number): DetailedListing {
  const key = String(id);
  if (detailedListingsData[key]) {
    return detailedListingsData[key];
  }

  // Generate realistic detail object for any listing ID
  const base = detailedListingsData["1"];
  return {
    ...base,
    id: key,
    title: `Cozy & Modern Property #${id} in Noida`,
    subtitle: `Entire rental unit in Noida, India`,
    pricePerNight: 3200 + ((Number(id) * 350) % 3000),
    originalPricePerNight: 6400 + ((Number(id) * 700) % 6000),
    lat: 28.5355 + ((Number(id) * 0.015) % 0.08) - 0.04,
    lng: 77.391 + ((Number(id) * 0.018) % 0.09) - 0.04,
  };
}

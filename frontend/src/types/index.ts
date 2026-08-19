export interface Stay {
  id: string;
  title: string;
  tagline: string;
  location: string;
  region: string;
  country: string;
  type: string;
  category: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  price: number; // In INR (₹)
  rating: number;
  reviewCount: number;
  images: string[];
  featured?: boolean;
  editorialPick?: boolean;
  superhost?: boolean;
  badge?: string;
  description: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export interface ReviewItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  stayTitle: string;
  rating: number;
  date: string;
}

export interface SearchState {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  propertyTypes: string[];
  bedrooms: number | 'any';
  superhostOnly: boolean;
}
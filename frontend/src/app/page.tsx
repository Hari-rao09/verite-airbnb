'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/header';
import HeroSection from '@/components/home/hero-section';
import SearchDiscovery from '@/components/home/search-discovery';
import CategoryNav from '@/components/home/category-nav';
import ContinuousTicker from '@/components/home/continuous-ticker';
import PropertyCard from '@/components/home/property-card';
import EditorialStory from '@/components/home/editorial-story';
import PropertyCarousel from '@/components/home/property-carousel';
import ReviewSection from '@/components/home/review-section';
import FinalCTA from '@/components/home/final-cta';
import Footer from '@/components/layout/footer';
import StayDetailModal from '@/components/home/stay-detail-modal';
import FilterModal from '@/components/home/filter-modal';

import { MOCK_PROPERTIES } from '@/data/mock-properties';
import { Stay, SearchState, FilterState } from '@/types';
import { Sparkles, SlidersHorizontal, MapPin } from 'lucide-react';

export default function HomePage() {
  // Active Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 50000],
    propertyTypes: [],
    bedrooms: 'any',
    superhostOnly: false,
  });

  // Featured Escape of the Month
  const featuredEscape = MOCK_PROPERTIES[0];

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((stay) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && stay.category !== selectedCategory) {
        return false;
      }

      // 2. Search Destination Filter
      if (searchState?.destination) {
        const query = searchState.destination.toLowerCase();
        const matchesLoc =
          stay.location.toLowerCase().includes(query) ||
          stay.title.toLowerCase().includes(query) ||
          stay.country.toLowerCase().includes(query);
        if (!matchesLoc) return false;
      }

      // 3. Guests Filter
      if (searchState?.guests) {
        const totalReq = searchState.guests.adults + searchState.guests.children;
        if (stay.guests < totalReq) return false;
      }

      // 4. Price Filter
      if (stay.price > filters.priceRange[1]) return false;

      // 5. Superhost Filter
      if (filters.superhostOnly && !stay.superhost) return false;

      return true;
    });
  }, [selectedCategory, searchState, filters]);

  // Curated collections for carousel section
  const curatedCarouselStays = MOCK_PROPERTIES.filter(
    (s) => s.editorialPick || s.featured
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-zinc-950">
      {/* 1. Scroll-Responsive Navbar */}
      <Header
        onOpenFilter={() => setFilterModalOpen(true)}
        onSelectProperty={(stay) => setSelectedStay(stay)}
      />

      {/* 2. Hero Section */}
      <HeroSection
        onExploreClick={() => {
          const el = document.getElementById('featured-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectProperty={(stay) => setSelectedStay(stay)}
        featuredStay={featuredEscape}
      />

      {/* 3. Interactive Search & Discovery Bar */}
      <SearchDiscovery
        onSearch={(state) => {
          setSearchState(state);
          const el = document.getElementById('featured-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Category Navigation Bar */}
      <CategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id)}
      />

      {/* 5. Continuous Travel Ticker */}
      <ContinuousTicker />

      {/* 6. Featured Property Grid Section */}
      <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Catalogue</span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-zinc-100">
              Handpicked Sanctuaries
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
              Showing {filteredProperties.length} extraordinary spaces
              {searchState?.destination && ` in "${searchState.destination}"`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-amber-400 text-xs font-semibold text-zinc-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Refine Search</span>
          </button>
        </div>

        {/* Property Grid */}
        {filteredProperties.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-zinc-900/40 rounded-3xl border border-zinc-800">
            <MapPin className="w-12 h-12 stroke-1 text-amber-400 mx-auto" />
            <h3 className="font-serif-editorial text-2xl text-zinc-200">
              No Escapes Match Your Criteria
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try expanding your destination search or resetting your price and category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchState(null);
                setFilters({
                  category: 'all',
                  priceRange: [0, 50000],
                  propertyTypes: [],
                  bedrooms: 'any',
                  superhostOnly: false,
                });
              }}
              className="px-6 py-2.5 rounded-full bg-amber-400 text-zinc-950 font-bold text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((stay) => (
              <PropertyCard
                key={stay.id}
                stay={stay}
                onSelect={(s) => setSelectedStay(s)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 7. Editorial Travel Story Section */}
      <EditorialStory />

      {/* 8. Horizontal Scroll Carousel */}
      <PropertyCarousel
        title="Royal Havelis & Heritage Forts"
        subtitle="Uncover timeless architecture restored for slow living"
        stays={curatedCarouselStays}
        onSelectProperty={(s) => setSelectedStay(s)}
      />

      {/* 9. Reviews & Testimonials Section */}
      <ReviewSection />

      {/* 10. Final CTA & Editorial Footer */}
      <FinalCTA />
      <Footer />

      {/* Interactive Modals */}
      <StayDetailModal
        stay={selectedStay}
        onClose={() => setSelectedStay(null)}
      />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
      />
    </div>
  );
}
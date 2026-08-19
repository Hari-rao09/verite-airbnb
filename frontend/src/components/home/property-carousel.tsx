'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Stay } from '@/types';
import PropertyCard from './property-card';

interface PropertyCarouselProps {
  title: string;
  subtitle?: string;
  stays: Stay[];
  onSelectProperty: (stay: Stay) => void;
}

export default function PropertyCarousel({
  title,
  subtitle,
  stays,
  onSelectProperty,
}: PropertyCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="carousel-section" className="py-12 bg-zinc-950/60 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Controls */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collection</span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-zinc-100">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors focus:outline-none"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors focus:outline-none"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Tracks */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {stays.map((stay) => (
            <div
              key={stay.id}
              className="w-[280px] sm:w-[320px] md:w-[350px] flex-shrink-0 snap-start"
            >
              <PropertyCard stay={stay} onSelect={onSelectProperty} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

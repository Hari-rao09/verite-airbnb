'use client';

import { ArrowDown, Sparkles, Compass, Play } from 'lucide-react';
import { Stay } from '@/types';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectProperty?: (stay: Stay) => void;
  featuredStay?: Stay;
}

export default function HeroSection({
  onExploreClick,
  onSelectProperty,
  featuredStay,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white pt-24 pb-16">
      {/* Background Editorial Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
          alt="Luxury Mountain Retreat"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered Gradient Overlays for Luxury Dark Aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-zinc-950/90" />
      </div>

      {/* Floating Highlight Badge */}
      {featuredStay && (
        <div
          onClick={() => onSelectProperty?.(featuredStay)}
          className="absolute top-28 right-6 lg:right-12 z-20 hidden md:flex items-center gap-3 p-2.5 pr-4 rounded-full glass-card hover:border-amber-400/50 cursor-pointer transition-all duration-300 group hover:scale-105"
        >
          <img
            src={featuredStay.images[0]}
            alt={featuredStay.title}
            className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
          />
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-amber-300 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Escape of the Month</span>
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate max-w-[180px] group-hover:text-amber-200">
              {featuredStay.title}
            </p>
          </div>
        </div>
      )}

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 mt-12">
        {/* Micro Category Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-xs font-medium tracking-widest uppercase text-amber-200">
            A Curation of Extraordinary Spaces
          </span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.1]">
          Stay somewhere <br className="hidden sm:inline" />
          <span className="italic font-normal text-amber-200/90 font-serif">
            unforgettable.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-300 font-light leading-relaxed">
          Handpicked architectural spaces, hidden mountain escapes, and coastal havens with a soul.
        </p>

        {/* Dual Primary & Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-base transition-all duration-300 shadow-xl shadow-amber-400/15 flex items-center justify-center gap-2.5 group"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            <span>Discover Escapes</span>
          </button>

          <a
            href="#editorial-section"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-zinc-500/30 hover:border-amber-400/60 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-200 font-medium text-base transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>Our Curation Story</span>
          </a>
        </div>
      </div>

      {/* Down Scroll Arrow Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-zinc-400">
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-zinc-500">
          Scroll to explore
        </span>
        <a
          href="#search-section"
          className="p-2 rounded-full border border-zinc-700 hover:border-amber-400 text-amber-400 transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

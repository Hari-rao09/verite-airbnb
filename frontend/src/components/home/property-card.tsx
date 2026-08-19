'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Stay } from '@/types';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface PropertyCardProps {
  stay: Stay;
  onSelect: (stay: Stay) => void;
}

export default function PropertyCard({ stay, onSelect }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(stay.id) : false;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % stay.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? stay.images.length - 1 : prev - 1
    );
  };

  return (
    <div
      onClick={() => onSelect(stay)}
      className="group relative bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-400/5 cursor-pointer flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={stay.images[currentImageIndex]}
          alt={stay.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for Readable Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20" />

        {/* Badge Tag */}
        {stay.badge && (
          <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{stay.badge}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(stay.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-zinc-950/60 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 transition-all text-white focus:outline-none"
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-zinc-300 hover:text-white'
            }`}
          />
        </button>

        {/* Image Navigation Arrows (Visible on Hover) */}
        {stay.images.length > 1 && (
          <div className="absolute inset-0 z-10 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={prevImage}
              className="p-1.5 rounded-full bg-zinc-950/80 text-white hover:bg-amber-400 hover:text-zinc-950 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="p-1.5 rounded-full bg-zinc-950/80 text-white hover:bg-amber-400 hover:text-zinc-950 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Carousel Dots */}
        {stay.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {stay.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentImageIndex
                    ? 'w-4 bg-amber-400'
                    : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400/90">
              {stay.type}
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-xs font-bold text-amber-300 border border-zinc-700/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{stay.rating.toFixed(2)}</span>
            </div>
          </div>

          <h3 className="font-serif-editorial text-lg font-bold text-zinc-100 group-hover:text-amber-200 transition-colors line-clamp-1">
            {stay.title}
          </h3>

          <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{stay.location}</span>
          </p>

          <p className="text-xs text-zinc-500 line-clamp-2 mt-2 font-light">
            {stay.tagline}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-zinc-100 font-sans">
              ₹{stay.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-zinc-400 font-normal"> / night</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Explore</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
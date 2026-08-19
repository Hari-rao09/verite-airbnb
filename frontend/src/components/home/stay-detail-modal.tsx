'use client';

import { useState, useEffect } from 'react';
import { X, Star, MapPin, Heart, Sparkles, Check, Compass } from 'lucide-react';
import { Stay } from '@/types';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

interface StayDetailModalProps {
  stay: Stay | null;
  onClose: () => void;
}

export default function StayDetailModal({ stay, onClose }: StayDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!stay) return null;
  const wishlisted = mounted ? isWishlisted(stay.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
              {stay.type}
            </span>
            {stay.badge && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700">
                {stay.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(stay.id)}
              className="p-2 rounded-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 focus:outline-none transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-300'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl overflow-hidden border border-zinc-800">
            <img
              src={stay.images[0]}
              alt={stay.title}
              className="sm:col-span-2 w-full h-64 sm:h-80 object-cover"
            />
            <div className="flex flex-col gap-3">
              {stay.images.slice(1, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${stay.title} ${i}`}
                  className="w-full h-32 sm:h-38 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-zinc-100">
                {stay.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{stay.location}, {stay.country}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 self-start">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <div>
                <span className="text-sm font-bold text-zinc-100">
                  {stay.rating.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-400 block font-normal">
                  {stay.reviewCount} Verified Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-3">
            <h3 className="font-serif-editorial text-lg font-bold text-amber-200">
              The Sanctuary Experience
            </h3>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              {stay.description}
            </p>
          </div>

          {/* Key Amenities */}
          <div className="space-y-3">
            <h3 className="font-serif-editorial text-lg font-bold text-amber-200">
              Bespoke Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stay.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-200"
                >
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Reserve Action */}
        <div className="p-4 sm:p-6 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-zinc-100">
              ₹{stay.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-zinc-400 font-normal"> / night</span>
          </div>

          <button
            type="button"
            onClick={() => alert(`Reservation inquiry sent for ${stay.title}!`)}
            className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all duration-300 flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Inquire Reservation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

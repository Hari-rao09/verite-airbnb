'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Compass,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  MapPin,
  Trash2,
} from 'lucide-react';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { MOCK_PROPERTIES } from '@/data/mock-properties';
import { Stay } from '@/types';

interface HeaderProps {
  onOpenFilter?: () => void;
  onSelectProperty?: (stay: Stay) => void;
}

export default function Header({ onOpenFilter, onSelectProperty }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const wishlistedStays = MOCK_PROPERTIES.filter((s) => wishlistIds.includes(s.id));

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl py-3.5 text-zinc-100'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#"
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-editorial text-2xl font-bold tracking-wider uppercase text-amber-200">
                  VÉRITÉ
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 -mt-1 font-medium">
                  ESCAPES
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a
                href="#search-section"
                className="transition-colors hover:text-amber-300 flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-md px-1"
              >
                <Compass className="w-4 h-4 text-amber-400/80" />
                Discover
              </a>
              <a
                href="#featured-section"
                className="transition-colors hover:text-amber-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-md px-1"
              >
                Featured Stays
              </a>
              <a
                href="#editorial-section"
                className="transition-colors hover:text-amber-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-md px-1"
              >
                Our Story
              </a>
              <a
                href="#carousel-section"
                className="transition-colors hover:text-amber-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-md px-1"
              >
                Curated Collections
              </a>
            </nav>

            {/* Actions & Controls */}
            <div className="flex items-center gap-3">
              {/* Currency Badge */}
              <button
                type="button"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-zinc-500/20 hover:border-amber-400/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                title="Currency & Language"
                aria-label="Currency: INR (₹)"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>INR (₹)</span>
              </button>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full border border-zinc-500/20 hover:bg-zinc-800/40 transition-colors text-amber-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                  aria-label="Toggle theme mode"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4 text-zinc-800" />
                  )}
                </button>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setWishlistDrawerOpen(true)}
                className="relative p-2 rounded-full border border-zinc-500/20 hover:bg-zinc-800/40 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                aria-label={`View Saved Wishlist (${wishlistIds.length} items)`}
              >
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-zinc-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </button>

              {/* Filter Trigger Button */}
              {onOpenFilter && (
                <button
                  type="button"
                  onClick={onOpenFilter}
                  className="hidden md:flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                  aria-label="Open filter preferences"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              )}

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg border border-zinc-500/20 hover:bg-zinc-800/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-amber-400" />
                ) : (
                  <Menu className="w-5 h-5 text-amber-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-zinc-950/98 backdrop-blur-2xl text-white p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-serif-editorial text-xl font-bold tracking-wider text-amber-200">
                VÉRITÉ
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full border border-zinc-800 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-lg font-serif-editorial font-medium tracking-wide">
            <a
              href="#search-section"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 flex items-center justify-between border-b border-zinc-800 pb-3"
            >
              <span>Discover Escapes</span>
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </a>
            <a
              href="#featured-section"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 flex items-center justify-between border-b border-zinc-800 pb-3"
            >
              <span>Featured Stays</span>
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </a>
            <a
              href="#editorial-section"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 flex items-center justify-between border-b border-zinc-800 pb-3"
            >
              <span>Editorial Story</span>
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </a>
            <a
              href="#reviews-section"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-300 flex items-center justify-between border-b border-zinc-800 pb-3"
            >
              <span>Guest Experiences</span>
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </a>
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setWishlistDrawerOpen(true);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 text-zinc-950 font-semibold text-sm"
              aria-label="Open Saved Wishlist"
            >
              <Heart className="w-4 h-4 fill-zinc-950" />
              <span>Saved Wishlist ({wishlistIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {wishlistDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 text-white h-full flex flex-col shadow-2xl border-l border-zinc-800 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="font-serif-editorial text-xl font-bold text-amber-100">
                  Your Saved Escapes ({wishlistedStays.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWishlistDrawerOpen(false)}
                className="p-2 rounded-full border border-zinc-800 hover:bg-zinc-800 focus:outline-none"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistedStays.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 space-y-3">
                  <Heart className="w-12 h-12 stroke-1 text-zinc-600 mx-auto" />
                  <p className="font-serif-editorial text-lg text-zinc-300">
                    Your wishlist is empty.
                  </p>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                    Click the heart icon on any stay card to save your favourite sanctuaries.
                  </p>
                </div>
              ) : (
                wishlistedStays.map((stay) => (
                  <div
                    key={stay.id}
                    className="flex gap-4 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 hover:border-amber-400/30 transition-all group"
                  >
                    <img
                      src={stay.images[0]}
                      alt={stay.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-wider uppercase text-amber-400 font-semibold">
                          {stay.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(stay.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          aria-label={`Remove ${stay.title} from wishlist`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4
                        onClick={() => {
                          setWishlistDrawerOpen(false);
                          onSelectProperty?.(stay);
                        }}
                        className="text-sm font-semibold text-zinc-200 truncate cursor-pointer hover:text-amber-300"
                      >
                        {stay.title}
                      </h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {stay.location}
                      </p>
                      <p className="text-xs font-bold text-amber-200 mt-2">
                        ₹{stay.price.toLocaleString('en-IN')}{' '}
                        <span className="font-normal text-zinc-400">/ night</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-950">
              <button
                type="button"
                onClick={() => setWishlistDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-colors text-center"
              >
                Close Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
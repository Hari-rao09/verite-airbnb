'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Plus,
  Minus,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DESTINATIONS_SUGGESTIONS } from '@/data/mock-properties';
import { SearchState } from '@/types';

interface SearchDiscoveryProps {
  onSearch: (state: SearchState) => void;
}

export default function SearchDiscovery({ onSearch }: SearchDiscoveryProps) {
  const [activeTab, setActiveTab] = useState<'where' | 'when' | 'who' | null>(null);

  const [destination, setDestination] = useState('');
  const [datePreset, setDatePreset] = useState<string | null>('This Weekend');
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const searchRef = useRef<HTMLDivElement>(null);

  const totalGuests = guests.adults + guests.children;

  // Close active tab when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGuestChange = (type: keyof typeof guests, delta: number) => {
    setGuests((prev) => {
      const current = prev[type];
      const next = Math.max(0, current + delta);
      if (type === 'adults' && next === 0) return prev; // At least 1 adult
      return { ...prev, [type]: next };
    });
  };

  const triggerSearch = () => {
    setActiveTab(null);
    onSearch({
      destination,
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 86400000 * 3),
      guests,
    });
  };

  return (
    <div id="search-section" className="relative z-30 max-w-5xl mx-auto px-4 -mt-12 sm:-mt-16">
      <div
        ref={searchRef}
        className="glass-card bg-zinc-900/90 border border-zinc-700/60 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl transition-all"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          {/* WHERE FIELD */}
          <div
            onClick={() => setActiveTab(activeTab === 'where' ? null : 'where')}
            className={`md:col-span-4 p-3.5 rounded-2xl cursor-pointer transition-all ${
              activeTab === 'where'
                ? 'bg-zinc-800 border border-amber-400/40 shadow-inner'
                : 'hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] tracking-widest uppercase font-bold text-zinc-400">
                  Where
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full bg-transparent text-sm font-semibold text-zinc-100 placeholder-zinc-500 focus:outline-none truncate"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={() => setActiveTab('where')}
                />
              </div>
              {destination && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDestination('');
                  }}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* WHEN FIELD */}
          <div
            onClick={() => setActiveTab(activeTab === 'when' ? null : 'when')}
            className={`md:col-span-4 p-3.5 rounded-2xl cursor-pointer transition-all ${
              activeTab === 'when'
                ? 'bg-zinc-800 border border-amber-400/40 shadow-inner'
                : 'hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] tracking-widest uppercase font-bold text-zinc-400">
                  When
                </span>
                <span className="text-sm font-semibold text-zinc-100 truncate block">
                  {datePreset || 'Select dates'}
                </span>
              </div>
            </div>
          </div>

          {/* GUESTS FIELD */}
          <div
            onClick={() => setActiveTab(activeTab === 'who' ? null : 'who')}
            className={`md:col-span-3 p-3.5 rounded-2xl cursor-pointer transition-all ${
              activeTab === 'who'
                ? 'bg-zinc-800 border border-amber-400/40 shadow-inner'
                : 'hover:bg-zinc-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] tracking-widest uppercase font-bold text-zinc-400">
                  Guests
                </span>
                <span className="text-sm font-semibold text-zinc-100 truncate block">
                  {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                  {guests.pets > 0 ? `, ${guests.pets} Pet` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="md:col-span-1 flex justify-end">
            <button
              type="button"
              onClick={triggerSearch}
              className="w-full md:w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold flex items-center justify-center transition-all duration-300 shadow-lg shadow-amber-400/20 group"
              aria-label="Search"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* POPOVER: WHERE SUGGESTIONS */}
        {activeTab === 'where' && (
          <div className="mt-3 p-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Popular Curated Destinations
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {DESTINATIONS_SUGGESTIONS.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    setDestination(item.name.split(',')[0]);
                    setActiveTab('when');
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700 cursor-pointer transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-200 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POPOVER: WHEN PRESETS */}
        {activeTab === 'when' && (
          <div className="mt-3 p-5 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
              Select Trip Horizon
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'This Weekend',
                'Next Week',
                'Next Month',
                'Anytime / Flexible',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setDatePreset(preset);
                    setActiveTab('who');
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    datePreset === preset
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-zinc-800 bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* POPOVER: GUESTS COUNTER */}
        {activeTab === 'who' && (
          <div className="mt-3 p-5 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-w-md ml-auto">
            <span className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
              Number of Travelling Guests
            </span>
            <div className="space-y-4">
              {[
                {
                  key: 'adults',
                  label: 'Adults',
                  sub: 'Age 13 or above',
                },
                {
                  key: 'children',
                  label: 'Children',
                  sub: 'Ages 2–12',
                },
                {
                  key: 'pets',
                  label: 'Pets',
                  sub: 'Service & companion pets',
                },
              ].map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-none"
                >
                  <div>
                    <p className="text-xs font-bold text-zinc-200">
                      {row.label}
                    </p>
                    <p className="text-[10px] text-zinc-400">{row.sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleGuestChange(
                          row.key as keyof typeof guests,
                          -1
                        )
                      }
                      className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-zinc-100 w-4 text-center">
                      {guests[row.key as keyof typeof guests]}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleGuestChange(row.key as keyof typeof guests, 1)
                      }
                      className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={triggerSearch}
              className="w-full mt-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Apply Guests ({totalGuests})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

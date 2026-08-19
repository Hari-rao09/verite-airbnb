'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { FilterState } from '@/types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultState: FilterState = {
      category: 'all',
      priceRange: [2000, 40000],
      propertyTypes: [],
      bedrooms: 'any',
      superhostOnly: false,
    };
    setLocalFilters(defaultState);
    onApplyFilters(defaultState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2 text-amber-300">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-serif-editorial text-xl font-bold text-zinc-100">
              Refine Escapes
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Max Price Range */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
              Max Price: ₹{localFilters.priceRange[1].toLocaleString('en-IN')} / night
            </label>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={localFilters.priceRange[1]}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Superhost Filter */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-zinc-200">Superhosts Only</p>
              <p className="text-[11px] text-zinc-400">
                Show stays hosted by top-rated luxury curators
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  superhostOnly: !prev.superhostOnly,
                }))
              }
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                localFilters.superhostOnly
                  ? 'bg-amber-400 border-amber-400 text-zinc-950'
                  : 'border-zinc-700 bg-zinc-800'
              }`}
            >
              {localFilters.superhostOnly && <Check className="w-4 h-4 font-bold" />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 underline"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

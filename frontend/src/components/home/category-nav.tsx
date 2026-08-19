'use client';

import {
  Compass,
  Castle,
  Mountain,
  Trees,
  Waves,
  Sun,
  Coffee,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '@/data/mock-properties';
import { useRef } from 'react';

interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-4 h-4" />,
  Castle: <Castle className="w-4 h-4" />,
  Mountain: <Mountain className="w-4 h-4" />,
  Trees: <Trees className="w-4 h-4" />,
  Waves: <Waves className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

export default function CategoryNav({
  activeCategory,
  onSelectCategory,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="relative flex items-center">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 z-10 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-400 shadow-xl transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Bar */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-1 w-full"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 group border focus:outline-none ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md shadow-amber-400/20 scale-105'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-zinc-950' : 'text-amber-400'
                  }`}
                >
                  {ICON_MAP[cat.iconName] || <Compass className="w-4 h-4" />}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 z-10 p-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-400 shadow-xl transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

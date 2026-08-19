'use client';

import { Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  'NEW ESCAPES 2026',
  'STAYS WITH A STORY',
  'HIDDEN INDIA',
  'SLOW TRAVEL SANCTUARIES',
  'ARCHITECTURAL GEMS',
  'ROYAL HERITAGE HAVENS',
  'DISCOVER PLACES WORTH TRAVELLING FOR',
];

export default function ContinuousTicker() {
  const repeatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full bg-zinc-900/90 border-y border-zinc-800/80 py-3.5 overflow-hidden select-none my-8">
      <div className="animate-ticker flex items-center gap-12 text-xs font-semibold tracking-[0.25em] text-zinc-400 uppercase">
        {repeatedItems.map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 whitespace-nowrap">
            <span className="hover:text-amber-300 transition-colors cursor-default">
              {text}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

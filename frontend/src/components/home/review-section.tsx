'use client';

import { Star, Quote, Sparkles } from 'lucide-react';
import { MOCK_REVIEWS } from '@/data/mock-properties';

export default function ReviewSection() {
  return (
    <section id="reviews-section" className="py-20 bg-zinc-950 text-white border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guest Stories</span>
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold text-zinc-100">
            Voices of Slow Travel
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            Real experiences shared by guests who discovered sanctuary with VÉRITÉ Escapes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between space-y-6 relative group hover:-translate-y-1"
            >
              <Quote className="w-10 h-10 text-amber-400/20 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-zinc-200 font-serif-editorial italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-4">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-11 h-11 rounded-full object-cover border border-amber-400/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                    {rev.author}
                  </h4>
                  <p className="text-xs text-zinc-400">{rev.role}</p>
                  <span className="text-[10px] text-amber-400/90 font-medium">
                    {rev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

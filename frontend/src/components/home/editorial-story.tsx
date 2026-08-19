'use client';

import { Sparkles, ShieldCheck, Award, HeartHandshake, ArrowRight } from 'lucide-react';

export default function EditorialStory() {
  return (
    <section id="editorial-section" className="py-20 bg-zinc-950 text-white border-y border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Magazine Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85"
                alt="Editorial Heritage Sanctuary"
                className="w-full h-[450px] sm:h-[550px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Curator Focus
                </span>
                <h4 className="font-serif-editorial text-lg font-bold text-zinc-100 mt-1">
                  Rawla Haveli, Udaipur
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  Restored 18th Century Water Palace overlooking Lake Pichola.
                </p>
              </div>
            </div>

            {/* Decorative Offset Glass Card */}
            <div className="hidden sm:flex absolute -bottom-8 -right-8 z-20 p-5 rounded-2xl bg-zinc-900/90 border border-amber-400/30 shadow-2xl backdrop-blur-xl max-w-xs items-center gap-4">
              <div className="p-3 rounded-full bg-amber-400/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-200">
                  Strictly 1% Accepted
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Every property undergo 50+ aesthetic & hospitality audits.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editorial Manifesto</span>
            </div>

            <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">
              Not every destination <br />
              <span className="italic font-serif font-normal text-amber-200">
                needs a crowd.
              </span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg font-light leading-relaxed">
              We created VÉRITÉ Escapes for travellers who seek depth over popularity.
              We hand-select spaces where architecture, nature, and slow living align.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <span className="block font-serif-editorial text-2xl sm:text-3xl font-bold text-amber-200">
                  80+
                </span>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Handpicked Stays
                </span>
              </div>
              <div>
                <span className="block font-serif-editorial text-2xl sm:text-3xl font-bold text-amber-200">
                  4.95
                </span>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Avg Rating
                </span>
              </div>
              <div>
                <span className="block font-serif-editorial text-2xl sm:text-3xl font-bold text-amber-200">
                  100%
                </span>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Verified Hosts
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="px-6 py-3.5 rounded-full bg-zinc-900 border border-amber-400/40 hover:bg-amber-400 hover:text-zinc-950 text-amber-300 font-semibold text-sm transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Read Full Curation Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

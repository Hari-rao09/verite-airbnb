'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Private Journal</span>
        </div>

        <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100">
          Begin your journey into <br />
          <span className="italic font-serif font-normal text-amber-200">
            slow travel.
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-300 font-light">
          Receive quarterly dispatches featuring unreleased private sanctuaries, architectural interviews, and secret Indian travel guides.
        </p>

        {submitted ? (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-300 flex items-center justify-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold">
              Welcome to VÉRITÉ Private Journal. Dispatches will arrive shortly.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-zinc-950/80 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

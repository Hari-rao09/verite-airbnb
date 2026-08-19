'use client';

import { Sparkles, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-serif-editorial text-2xl font-bold tracking-wider text-amber-200 uppercase">
                VÉRITÉ
              </span>
            </div>
            <p className="text-zinc-400 text-xs font-light max-w-sm leading-relaxed">
              Discover places worth travelling for. VÉRITÉ Escapes curates architectural sanctuaries, heritage havens, and slow travel retreats across India and worldwide.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>India • International Destinations</span>
            </div>
          </div>

          {/* Destinations Col */}
          <div className="space-y-3">
            <h4 className="font-serif-editorial text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Destinations
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-amber-300 transition-colors">Shimla & Himalayas</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Udaipur & Mewar Forts</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">North Goa Coast</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Coorg Tea Estates</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Wayanad Rainforests</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Jaisalmer Desert</a></li>
            </ul>
          </div>

          {/* Curation Col */}
          <div className="space-y-3">
            <h4 className="font-serif-editorial text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-amber-300 transition-colors">Heritage Palaces</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Alpine Chalets</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Forest Cabins</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Architectural Gems</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Slow Living Retreats</a></li>
            </ul>
          </div>

          {/* Brand Col */}
          <div className="space-y-3">
            <h4 className="font-serif-editorial text-sm font-bold text-zinc-100 uppercase tracking-wider">
              About VÉRITÉ
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-amber-300 transition-colors">Our Manifesto</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Host Curation Audit</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Sustainability Standard</a></li>
              <li><a href="#" className="hover:text-amber-300 transition-colors">Private Dispatches</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 VÉRITÉ ESCAPES. All rights reserved. Crafted with care for slow travel.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Curation Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
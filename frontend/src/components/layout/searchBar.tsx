'use client';

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  X,
  MapPin,
  CalendarDays,
  Users,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

type ActiveSection = 'destination' | 'dates' | 'guests' | null;

interface SearchBarProps {
  initialSection?: ActiveSection;
}

const SearchBar = ({ initialSection }: SearchBarProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection || null);
  const [dateTab, setDateTab] = useState<'dates' | 'months' | 'flexible'>('dates');
  const [searchLocation, setSearchLocation] = useState<string>("");

  // Dynamic Date Range Selection (YYYY-MM-DD)
  const [startDate, setStartDate] = useState<string | null>("2026-08-28");
  const [endDate, setEndDate] = useState<string | null>("2026-08-30");
  const [monthOffset, setMonthOffset] = useState<number>(0);

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Prevent body scroll on mobile when modal is active
  useEffect(() => {
    if (activeSection && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSection]);

  const totalGuests = guests.adults + guests.children;

  // Today's date string in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const whenDisplay = useMemo(() => {
    if (startDate && endDate) {
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const m1 = d1.toLocaleString("default", { month: "short" });
      const m2 = d2.toLocaleString("default", { month: "short" });
      if (m1 === m2) {
        return `${d1.getDate()}–${d2.getDate()} ${m1}`;
      }
      return `${d1.getDate()} ${m1} – ${d2.getDate()} ${m2}`;
    }
    if (startDate) {
      const d1 = new Date(startDate);
      return `From ${d1.getDate()} ${d1.toLocaleString("default", { month: "short" })}`;
    }
    return "Add dates";
  }, [startDate, endDate]);

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr) return; // Prevent selecting past dates

    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (dateStr <= startDate) {
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  const month1Date = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const month2Date = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset + 1);
    return d;
  }, [monthOffset]);

  const renderCalendarMonth = (targetDate: Date) => {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const monthName = targetDate.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
      <div key={monthName} className="select-none">
        <h4 className="font-bold text-center text-sm text-gray-900 dark:text-white mb-3">
          {monthName}
        </h4>
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
          {weekdays.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-xs gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`} className="p-2" />
          ))}
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isPast = dateStr < todayStr;
            const isStart = startDate === dateStr;
            const isEnd = endDate === dateStr;
            const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;

            let btnClass = "rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333] cursor-pointer transition font-medium";

            if (isPast) {
              btnClass = "line-through decoration-rose-500 decoration-[1.5px] text-gray-400 dark:text-gray-600 bg-transparent cursor-not-allowed opacity-40 font-normal hover:bg-transparent";
            } else if (isStart || isEnd) {
              btnClass = "bg-black dark:bg-white text-white dark:text-black font-bold rounded-full shadow-sm";
            } else if (isInRange) {
              btnClass = "bg-gray-100 dark:bg-[#333333] text-gray-900 dark:text-white font-medium rounded-none";
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onClick={() => handleDateClick(dateStr)}
                title={isPast ? "Date has passed" : dateStr}
                className={`w-full aspect-square flex items-center justify-center text-xs ${btnClass}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const suggestedDestinations = [
    {
      name: "Noida, India",
      description: "Known for luxury stays & modern city life",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80",
    },
    {
      name: "Goa, India",
      description: "Beach parties, villas & tropical sun",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80",
    },
    {
      name: "Manali, Himachal Pradesh",
      description: "Snowy peaks, apple orchards & cozy chalets",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&q=80",
    },
    {
      name: "Mumbai, Maharashtra",
      description: "Marine Drive skyline & bustling nightlife",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80",
    },
    {
      name: "Jaipur, Rajasthan",
      description: "Royal heritage havelis & pink city palaces",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80",
    },
    {
      name: "New Delhi, India",
      description: "Hauz Khas monuments & rich culture",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80",
    },
    {
      name: "Wayanad, Kerala",
      description: "Rainforest treehouses & spice plantations",
      image: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=200&q=80",
    },
    {
      name: "Rishikesh, Uttarakhand",
      description: "Riverside glamping & peaceful retreats",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=200&q=80",
    },
  ];

  const updateGuests = (type: keyof typeof guests, increment: boolean) => {
    setGuests((prev) => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  const handleSearch = (loc?: string) => {
    const dest = loc || searchLocation || "Noida";
    setActiveSection(null);
    router.push(`/s/${encodeURIComponent(dest)}`);
  };

  const clearAll = () => {
    setSearchLocation("");
    setGuests({ adults: 0, children: 0, babies: 0, pets: 0 });
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="relative flex items-center justify-center h-16 w-full pb-15 max-w-[850px] mx-auto">
      {/* SEARCH BAR CONTAINER */}
      <div
        className={`flex items-center w-full border border-gray-300 dark:border-[#383838] rounded-full shadow-lg transition-colors ${
          activeSection ? 'bg-[#EBEBEB] dark:bg-[#2a2a2a]' : 'bg-white dark:bg-[#242424]'
        }`}
      >
        {/* WHERE */}
        <button
          onClick={() => setActiveSection(activeSection === 'destination' ? null : 'destination')}
          className={`flex-1 py-3 px-4 sm:px-6 md:px-8 text-left rounded-full transition-colors ${
            activeSection === 'destination'
              ? 'bg-white dark:bg-[#383838] shadow-xl text-gray-900 dark:text-white'
              : activeSection
              ? 'hover:bg-[#DDDDDD] dark:hover:bg-[#333333] text-gray-800 dark:text-gray-200'
              : 'hover:bg-gray-100 dark:hover:bg-[#2e2e2e] text-gray-800 dark:text-gray-200'
          }`}
        >
          <div className="text-xs font-semibold">Where</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {searchLocation || "Search destinations"}
          </div>
        </button>

        <div className={`h-8 w-px ${activeSection ? 'bg-transparent' : 'bg-gray-300 dark:bg-gray-700'}`}></div>

        {/* WHEN */}
        <button
          onClick={() => setActiveSection(activeSection === 'dates' ? null : 'dates')}
          className={`flex-1 py-3 px-4 sm:px-6 md:px-8 text-left rounded-full transition-colors ${
            activeSection === 'dates'
              ? 'bg-white dark:bg-[#383838] shadow-xl text-gray-900 dark:text-white'
              : activeSection
              ? 'hover:bg-[#DDDDDD] dark:hover:bg-[#333333] text-gray-800 dark:text-gray-200'
              : 'hover:bg-gray-100 dark:hover:bg-[#2e2e2e] text-gray-800 dark:text-gray-200'
          }`}
        >
          <div className="text-xs font-semibold">When</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {whenDisplay}
          </div>
        </button>

        <div className={`h-8 w-px ${activeSection ? 'bg-transparent' : 'bg-gray-300 dark:bg-gray-700'}`}></div>

        {/* WHO */}
        <button
          onClick={() => setActiveSection(activeSection === 'guests' ? null : 'guests')}
          className={`flex-1 py-3 px-3 sm:px-4 md:px-6 text-left rounded-full transition-colors ${
            activeSection === 'guests'
              ? 'bg-white dark:bg-[#383838] shadow-xl text-gray-900 dark:text-white'
              : activeSection
              ? 'hover:bg-[#DDDDDD] dark:hover:bg-[#333333] text-gray-800 dark:text-gray-200'
              : 'hover:bg-gray-100 dark:hover:bg-[#2e2e2e] text-gray-800 dark:text-gray-200'
          }`}
        >
          <div className="text-xs font-semibold">Who</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : "Add guests"}
          </div>
        </button>

        {/* SEARCH BUTTON */}
        <button
          onClick={() => handleSearch()}
          className="mr-2 p-3.5 md:p-4 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center shrink-0"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* =========================================================================
          DESKTOP DROPDOWN PANELS (md:flex)
      ========================================================================= */}
      {activeSection && (
        <>
          {/* DESTINATION DROPDOWN */}
          {activeSection === 'destination' && (
            <div
              className="hidden md:flex md:flex-col absolute top-12 left-0 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#333333] z-50 text-gray-900 dark:text-gray-100 p-6 animate-in zoom-in-95 duration-150"
              style={{ width: '450px', maxHeight: '520px' }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                Suggested destinations
              </h3>
              <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                {suggestedDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => {
                      setSearchLocation(dest.name);
                      setActiveSection('dates');
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-left rounded-2xl group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-[#333333]">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {dest.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {dest.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DATES DROPDOWN (DESKTOP) */}
          {activeSection === 'dates' && (
            <div
              className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#333333] p-6 z-50 text-gray-900 dark:text-gray-100 animate-in zoom-in-95 duration-150"
              style={{ width: '820px' }}
            >
              {/* Top Selector & Month Controls */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                <div className="inline-flex items-center bg-[#EBEBEB] dark:bg-[#2e2e2e] rounded-full p-1">
                  <button
                    onClick={() => setDateTab('dates')}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${
                      dateTab === 'dates'
                        ? 'bg-white dark:bg-[#383838] shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Exact Dates
                  </button>
                  <button
                    onClick={() => setDateTab('months')}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${
                      dateTab === 'months'
                        ? 'bg-white dark:bg-[#383838] shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Months
                  </button>
                  <button
                    onClick={() => setDateTab('flexible')}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${
                      dateTab === 'flexible'
                        ? 'bg-white dark:bg-[#383838] shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Flexible
                  </button>
                </div>

                {/* Month navigation controls */}
                <div className="flex items-center gap-2">
                  {(startDate || endDate) && (
                    <button
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      className="text-xs font-bold underline text-gray-500 hover:text-black dark:hover:text-white mr-3"
                    >
                      Clear dates
                    </button>
                  )}

                  <button
                    onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
                    disabled={monthOffset === 0}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#383838] flex items-center justify-center hover:border-black dark:hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  <button
                    onClick={() => setMonthOffset((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#383838] flex items-center justify-center hover:border-black dark:hover:border-white transition"
                    aria-label="Next month"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* 2-MONTH CALENDAR */}
              <div className="grid grid-cols-2 gap-8">
                {renderCalendarMonth(month1Date)}
                {renderCalendarMonth(month2Date)}
              </div>

              {/* CALENDAR LEGEND */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-[#2a2a2a] text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-black dark:bg-white" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e1e]" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-100 dark:bg-[#2c2c2c] flex items-center justify-center text-[9px] line-through decoration-rose-500 text-gray-400">
                      12
                    </span>
                    <span>Passed / Cut</span>
                  </div>
                </div>

                <div className="text-[11px] font-medium text-gray-400">
                  {startDate && endDate ? `${whenDisplay} selected` : "Select check-in & check-out dates"}
                </div>
              </div>
            </div>
          )}

          {/* GUESTS DROPDOWN */}
          {activeSection === 'guests' && (
            <div
              className="hidden md:block absolute top-12 right-0 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-200 dark:border-[#333333] p-6 z-50 text-gray-900 dark:text-gray-100 animate-in zoom-in-95 duration-150"
              style={{ width: '400px' }}
            >
              {/* Adults */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#2a2a2a]">
                <div>
                  <div className="font-bold text-sm">Adults</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGuests('adults', false)}
                    disabled={guests.adults === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{guests.adults}</span>
                  <button
                    onClick={() => updateGuests('adults', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#2a2a2a]">
                <div>
                  <div className="font-bold text-sm">Children</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGuests('children', false)}
                    disabled={guests.children === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{guests.children}</span>
                  <button
                    onClick={() => updateGuests('children', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#2a2a2a]">
                <div>
                  <div className="font-bold text-sm">Infants</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Under 2</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGuests('babies', false)}
                    disabled={guests.babies === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{guests.babies}</span>
                  <button
                    onClick={() => updateGuests('babies', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pets */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-bold text-sm">Pets</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 underline">
                    Bringing a service animal?
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateGuests('pets', false)}
                    disabled={guests.pets === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{guests.pets}</span>
                  <button
                    onClick={() => updateGuests('pets', true)}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Desktop Backdrop for outside click */}
      {activeSection && (
        <div
          className="hidden md:block fixed inset-0 z-40"
          onClick={() => setActiveSection(null)}
        ></div>
      )}

      {/* =========================================================================
          MOBILE FULL SCREEN MODAL VIA REACT PORTAL (md:hidden)
      ========================================================================= */}
      {mounted && activeSection && createPortal(
        <div className="md:hidden fixed inset-0 z-[99999] h-[100dvh] w-screen bg-white dark:bg-[#121212] flex flex-col text-gray-900 dark:text-gray-100 animate-in slide-in-from-bottom duration-250">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-200 dark:border-[#2a2a2a] shrink-0 bg-white dark:bg-[#121212]">
            <button
              onClick={() => setActiveSection(null)}
              className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] transition"
              aria-label="Close search"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#222222] p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setActiveSection('destination')}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  activeSection === 'destination'
                    ? 'bg-white dark:bg-[#383838] shadow-sm text-black dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Where
              </button>
              <button
                onClick={() => setActiveSection('dates')}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  activeSection === 'dates'
                    ? 'bg-white dark:bg-[#383838] shadow-sm text-black dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                When
              </button>
              <button
                onClick={() => setActiveSection('guests')}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  activeSection === 'guests'
                    ? 'bg-white dark:bg-[#383838] shadow-sm text-black dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Who
              </button>
            </div>

            <div className="w-9"></div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {/* WHERE / DESTINATION */}
            {activeSection === 'destination' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Where to?</h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search destinations (e.g. Noida, Goa)"
                    className="w-full pl-12 pr-10 py-4 rounded-2xl border border-gray-300 dark:border-[#383838] bg-gray-50 dark:bg-[#1e1e1e] font-semibold text-base focus:border-black dark:focus:border-white transition outline-none"
                  />
                  {searchLocation && (
                    <button
                      onClick={() => setSearchLocation("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Popular destinations
                  </h3>
                  <div className="space-y-2">
                    {suggestedDestinations.map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => {
                          setSearchLocation(dest.name);
                          setActiveSection('dates');
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#222222] transition text-left"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-[#333]">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white">
                            {dest.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {dest.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WHEN / DATES (MOBILE) */}
            {activeSection === 'dates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">When's your trip?</h2>
                  {(startDate || endDate) && (
                    <button
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      className="text-xs font-bold underline text-gray-500 hover:text-black dark:hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 dark:border-[#2a2a2a] rounded-3xl p-5 bg-gray-50/50 dark:bg-[#1a1a1a] space-y-6">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setMonthOffset((prev) => Math.max(0, prev - 1))}
                      disabled={monthOffset === 0}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#383838] flex items-center justify-center hover:border-black dark:hover:border-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <span className="text-xs font-bold text-gray-500">
                      {whenDisplay}
                    </span>

                    <button
                      onClick={() => setMonthOffset((prev) => prev + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#383838] flex items-center justify-center hover:border-black dark:hover:border-white transition"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  {renderCalendarMonth(month1Date)}
                  {renderCalendarMonth(month2Date)}
                </div>
              </div>
            )}

            {/* WHO / GUESTS */}
            {activeSection === 'guests' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Who's coming?</h2>
                <div className="divide-y divide-gray-100 dark:divide-[#252525]">
                  {/* Adults */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-bold text-base">Adults</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Ages 13 or above
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('adults', false)}
                        disabled={guests.adults === 0}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-base">{guests.adults}</span>
                      <button
                        onClick={() => updateGuests('adults', true)}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-bold text-base">Children</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('children', false)}
                        disabled={guests.children === 0}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-base">{guests.children}</span>
                      <button
                        onClick={() => updateGuests('children', true)}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-bold text-base">Infants</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Under 2</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('babies', false)}
                        disabled={guests.babies === 0}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-base">{guests.babies}</span>
                      <button
                        onClick={() => updateGuests('babies', true)}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-bold text-base">Pets</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 underline">
                        Bringing a service animal?
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateGuests('pets', false)}
                        disabled={guests.pets === 0}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30 hover:border-black dark:hover:border-white transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-base">{guests.pets}</span>
                      <button
                        onClick={() => updateGuests('pets', true)}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-black dark:hover:border-white transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sticky Action Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-[#2a2a2a] flex items-center justify-between bg-white dark:bg-[#121212] shrink-0">
            <button
              onClick={clearAll}
              className="text-sm font-bold underline text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              Clear all
            </button>

            <button
              onClick={() => handleSearch()}
              className="bg-[#FF385C] hover:bg-[#E00B41] text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchBar;
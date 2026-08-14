"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    propertyId: string;
    title: string;
    location: string;
    checkIn: string;
    checkOut: string;
  } | null;
  onSubmitSuccess: (bookingId: string, rating: number, comment: string) => void;
}

const ratingLabels = [
  "Select rating",
  "Terrible stay 😞",
  "Below expectations 😕",
  "Average experience 😐",
  "Very good stay 😊",
  "Exceptional stay! ⭐⭐⭐⭐⭐",
];

export default function WriteReviewModal({
  isOpen,
  onClose,
  booking,
  onSubmitSuccess,
}: WriteReviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Category ratings
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [location, setLocation] = useState(5);
  const [value, setValue] = useState(5);

  const [comment, setComment] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsSubmitted(false);
      setComment("");
      setPrivateNote("");
      setOverallRating(5);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please share a short review of your stay.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitSuccess(booking.id, overallRating, comment);
      setTimeout(() => {
        onClose();
      }, 1600);
    }, 800);
  };

  const renderStarSelector = (
    currentVal: number,
    setter: (v: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 hover:scale-110 transition"
          >
            <Star
              size={18}
              className={`${
                star <= currentVal
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] max-h-[90vh] bg-white dark:bg-[#181818] text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-[#333] animate-in zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#2a2a2a] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Write a Review
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {booking.title} • {booking.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-90 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Review Published!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Thank you for helping the AirClone host and community with your verified feedback.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OVERALL STAR RATING */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] text-center space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Overall Rating
                </p>
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = hoverRating || overallRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setOverallRating(star)}
                        className="p-1 hover:scale-125 transition duration-150"
                      >
                        <Star
                          size={32}
                          className={`${
                            star <= activeRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {ratingLabels[hoverRating || overallRating]}
                </p>
              </div>

              {/* CATEGORY RATINGS BREAKDOWN */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Detailed Ratings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Cleanliness</span>
                    {renderStarSelector(cleanliness, setCleanliness)}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Accuracy</span>
                    {renderStarSelector(accuracy, setAccuracy)}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Communication</span>
                    {renderStarSelector(communication, setCommunication)}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Location</span>
                    {renderStarSelector(location, setLocation)}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] sm:col-span-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Value for money</span>
                    {renderStarSelector(value, setValue)}
                  </div>
                </div>
              </div>

              {/* PUBLIC REVIEW TEXTAREA */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Public Feedback (Visible to guests)
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience, the host's hospitality, comfort of the beds, amenities, or nearby spots..."
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-[#383838] bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#FF385C]"
                />
              </div>

              {/* PRIVATE NOTE (OPTIONAL) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Private Note to Host (Optional)
                </label>
                <textarea
                  rows={2}
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="Private suggestions or thank-you note only visible to your host..."
                  className="w-full p-3 rounded-2xl border border-gray-200 dark:border-[#383838] bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#FF385C]"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="w-full py-3.5 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting review...</span>
                ) : (
                  <>
                    <Star size={16} className="fill-white" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

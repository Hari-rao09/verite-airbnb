"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface MapListing {
  id: number | string;
  title: string;
  price: number;
  lat: number;
  lng: number;
  image?: string;
  rating?: number;
  location?: string;
}

interface AirbnbMapProps {
  listings: MapListing[];
  selectedListingId?: number | string | null;
  onSelectListing?: (id: number | string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function AirbnbMap({
  listings,
  selectedListingId,
  onSelectListing,
  center = [28.5355, 77.391], // Noida coordinates
  zoom = 12,
  className = "w-full h-full",
}: AirbnbMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false, // We'll add custom modern Airbnb zoom buttons
        attributionControl: false,
      });

      // CartoDB Positron tiles for clean, elegant Airbnb aesthetic
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add custom price pill markers for each listing
    listings.forEach((listing) => {
      if (!listing.lat || !listing.lng) return;

      const isSelected = String(selectedListingId) === String(listing.id);

      const customIcon = L.divIcon({
        className: "custom-leaflet-div-icon",
        html: `
          <div class="airbnb-price-marker ${isSelected ? "active" : ""}" id="marker-${listing.id}">
            ₹${listing.price.toLocaleString("en-IN")}
          </div>
        `,
        iconSize: [64, 28],
        iconAnchor: [32, 14],
      });

      const marker = L.marker([listing.lat, listing.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on("click", () => {
        if (onSelectListing) {
          onSelectListing(listing.id);
        }
      });

      markersRef.current[String(listing.id)] = marker;
    });

    // Auto-fit bounds if we have listings with coordinates
    const validCoords = listings
      .filter((l) => l.lat && l.lng)
      .map((l) => [l.lat, l.lng] as [number, number]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    return () => {
      // Keep map instance alive across rerenders, update markers
    };
  }, [listings, selectedListingId]);

  // Update active marker styling when selectedListingId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    listings.forEach((listing) => {
      const el = document.getElementById(`marker-${listing.id}`);
      if (el) {
        if (String(selectedListingId) === String(listing.id)) {
          el.classList.add("active");
          // Pan smoothly to selected listing
          if (listing.lat && listing.lng) {
            mapInstanceRef.current?.panTo([listing.lat, listing.lng], {
              animate: true,
              duration: 0.5,
            });
          }
        } else {
          el.classList.remove("active");
        }
      }
    });
  }, [selectedListingId, listings]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-gray-200 dark:border-[#333333] shadow-sm ${
        isFullscreen
          ? "fixed inset-0 z-[100] rounded-none border-none h-screen w-screen"
          : className
      }`}
    >
      {/* MAP CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

      {/* TOP-RIGHT FULLSCREEN BUTTON */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-white shadow-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a] flex items-center justify-center border border-gray-200 dark:border-[#333333] transition"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen map"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isFullscreen ? (
              <>
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </>
            ) : (
              <>
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* FLOATING ZOOM CONTROLS */}
      <div className="absolute top-16 right-4 z-[400] flex flex-col bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md border border-gray-200 dark:border-[#333333] overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-lg font-bold border-b border-gray-200 dark:border-[#333333] transition"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-lg font-bold transition"
          title="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Story } from "@/lib/sheets";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg";

// Country to coordinates mapping
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Europe
  "France": { lat: 46.2276, lng: 2.2137 },
  "Italy": { lat: 41.8719, lng: 12.5674 },
  "Spain": { lat: 40.4637, lng: -3.7492 },
  "Greece": { lat: 39.0742, lng: 21.8243 },
  "Bulgaria": { lat: 42.7339, lng: 25.4858 },
  "Romania": { lat: 45.9432, lng: 24.9668 },
  "Ukraine": { lat: 48.3794, lng: 31.1656 },
  "Russia": { lat: 55.7558, lng: 37.6173 },
  "Norway": { lat: 60.4720, lng: 8.4689 },
  "Ireland": { lat: 53.1424, lng: -7.6921 },
  "Scotland": { lat: 56.4907, lng: -4.2026 },
  "Netherlands": { lat: 52.1326, lng: 5.2913 },
  
  // Middle East
  "Turkey": { lat: 38.9637, lng: 35.2433 },
  "Iran": { lat: 32.4279, lng: 53.6880 },
  "Iraq": { lat: 33.2232, lng: 43.6793 },
  "Syria": { lat: 34.8021, lng: 38.9968 },
  "Lebanon": { lat: 33.8547, lng: 35.8623 },
  "Jordan": { lat: 30.5852, lng: 36.2384 },
  "Palestine": { lat: 31.9522, lng: 35.2332 },
  "Arabia": { lat: 23.8859, lng: 45.0792 },
  
  // Central Asia
  "Uzbekistan": { lat: 41.3775, lng: 64.5853 },
  "Turkmenistan": { lat: 38.9697, lng: 59.5563 },
  "Kyrgyzstan": { lat: 41.2044, lng: 74.7661 },
  "Afghanistan": { lat: 33.9391, lng: 67.7100 },
  "Azerbaijan": { lat: 40.1431, lng: 47.5769 },
  
  // South Asia
  "India": { lat: 20.5937, lng: 78.9629 },
  "Bhutan": { lat: 27.5142, lng: 90.4336 },
  "Tibet": { lat: 29.6500, lng: 91.1000 },
  
  // East Asia
  "China": { lat: 35.8617, lng: 104.1954 },
  "Japan": { lat: 36.2048, lng: 138.2529 },
  
  // Southeast Asia
  "Indonesia": { lat: -0.7893, lng: 113.9213 },
  "Vietnam": { lat: 14.0583, lng: 108.2772 },
  "Thailand": { lat: 15.8700, lng: 100.9925 },
  "Philippines": { lat: 12.8797, lng: 121.7740 },
  
  // North Africa
  "Morocco": { lat: 31.7917, lng: -7.0926 },
  "Algeria": { lat: 28.0339, lng: 1.6596 },
  "Tunisia": { lat: 33.8869, lng: 9.5375 },
  "Libya": { lat: 26.3351, lng: 17.2283 },
  "Egypt": { lat: 26.8206, lng: 30.8025 },
  
  // West Africa
  "Mali": { lat: 17.5707, lng: -3.9962 },
  "Senegal": { lat: 14.4974, lng: -14.4524 },
  "Ghana": { lat: 7.9465, lng: -1.0232 },
  "Nigeria": { lat: 9.0820, lng: 8.6753 },
  "Niger": { lat: 17.6078, lng: 8.0817 },
  "Ivory Coast": { lat: 7.5400, lng: -5.5471 },
  "Mauritania": { lat: 21.0079, lng: -10.9408 },
  
  // East Africa
  "Ethiopia": { lat: 9.1450, lng: 40.4897 },
  "Kenya": { lat: -0.0236, lng: 37.9062 },
  "Tanzania": { lat: -6.3690, lng: 34.8888 },
  "Uganda": { lat: 1.3733, lng: 32.2903 },
  "Madagascar": { lat: -18.7669, lng: 46.8691 },
  
  // Central Africa
  "Congo": { lat: -4.0383, lng: 21.7587 },
  
  // Americas
  "USA": { lat: 37.0902, lng: -95.7129 },
  "Canada": { lat: 56.1304, lng: -106.3468 },
  "Mexico": { lat: 23.6345, lng: -102.5528 },
  "Guatemala": { lat: 15.7835, lng: -90.2308 },
  "Panama": { lat: 8.5380, lng: -80.7821 },
  "Peru": { lat: -9.1900, lng: -75.0152 },
  "Bolivia": { lat: -16.2902, lng: -63.5887 },
  "Chile": { lat: -35.6751, lng: -71.5430 },
  
  // Oceania
  "Polynesia": { lat: -17.6797, lng: -149.4068 },
  "Tonga": { lat: -21.1790, lng: -175.1982 },
  "Fiji": { lat: -17.7134, lng: 178.0650 },
  "New Zealand": { lat: -40.9006, lng: 174.8860 },
};

// Get coordinates for a country
function getCountryCoords(country: string): { lat: number; lng: number } | null {
  if (!country || country === "Multiple") return null;
  return COUNTRY_COORDS[country] || null;
}

interface StoriesMapViewProps {
  stories: Story[];
}

export default function StoriesMapView({ stories }: StoriesMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    
    if (!gl) {
      setMapError(true);
      return;
    }

    const loadMapbox = async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        
        if (!mapContainer.current || map.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: [40, 25], // Center on Middle East/Mediterranean
          zoom: 2,
          attributionControl: false,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.current.on("load", () => {
          setMapLoaded(true);

          // Add markers for each story with a country
          stories.forEach((story) => {
            const coords = getCountryCoords(story.country);
            if (!coords) return;

            // Create custom marker element
            const el = document.createElement("div");
            el.className = "story-marker";
            el.style.width = "16px";
            el.style.height = "16px";
            el.style.backgroundColor = "#8b4513";
            el.style.borderRadius = "50%";
            el.style.border = "2px solid #FAF9F7";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
            el.style.cursor = "pointer";
            el.style.transition = "transform 0.2s";

            const marker = new mapboxgl.Marker({
              element: el,
              anchor: "center",
            })
              .setLngLat([coords.lng, coords.lat])
              .addTo(map.current);

            el.addEventListener("click", () => {
              setSelectedStory(story);
              map.current.flyTo({
                center: [coords.lng, coords.lat],
                zoom: 4,
                duration: 1000,
              });
            });

            el.addEventListener("mouseenter", () => {
              el.style.transform = "scale(1.3)";
            });

            el.addEventListener("mouseleave", () => {
              el.style.transform = "scale(1)";
            });
          });
        });

        map.current.on("error", () => {
          setMapError(true);
        });
      } catch (err) {
        console.error("Mapbox failed to load:", err);
        setMapError(true);
      }
    };

    loadMapbox();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stories]);

  // Stories with/without country
  const storiesWithCountry = stories.filter((s) => getCountryCoords(s.country));
  const storiesWithoutCountry = stories.filter((s) => !getCountryCoords(s.country));

  if (mapError) {
    return (
      <div className="bg-sand p-12 text-center">
        <p className="font-body text-charcoal/60">
          Map view requires a modern browser with WebGL support.
        </p>
        <p className="font-body text-charcoal/40 text-sm mt-2">
          Please use the grid view to browse stories.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative h-[70vh] bg-sand">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-sand">
            <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
          </div>
        )}

        {/* Selected Story Popup */}
        {selectedStory && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-cream shadow-xl border border-charcoal/10 z-10">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors z-10"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>
            
            {selectedStory.heroImage && (
              <div className="relative aspect-[16/9]">
                <Image
                  src={selectedStory.heroImage}
                  alt={selectedStory.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <p className="text-meta uppercase tracking-extra-wide text-stone mb-2">
                {selectedStory.country || selectedStory.region || selectedStory.category}
              </p>
              <h3 className="font-display text-xl mb-2">{selectedStory.title}</h3>
              {selectedStory.subtitle && (
                <p className="font-body text-sm text-charcoal/60 italic mb-4">
                  {selectedStory.subtitle}
                </p>
              )}
              <Link
                href={`/story/${selectedStory.slug}`}
                className="inline-block text-meta uppercase tracking-extra-wide text-accent hover:text-charcoal transition-colors"
              >
                Read Story →
              </Link>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-6 left-6 bg-cream/90 backdrop-blur-sm p-4 text-sm">
          <p className="font-body text-charcoal/60">
            <span className="inline-block w-3 h-3 bg-accent rounded-full mr-2" />
            {storiesWithCountry.length} stories mapped
          </p>
        </div>
      </div>

      {/* Stories without country - horizontal scroll */}
      {storiesWithoutCountry.length > 0 && (
        <div className="border-t border-charcoal/10 py-8 px-6">
          <p className="text-meta uppercase tracking-extra-wide text-stone mb-4">
            Additional Stories ({storiesWithoutCountry.length})
          </p>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {storiesWithoutCountry.map((story) => (
              <Link
                key={story.slug}
                href={`/story/${story.slug}`}
                className="flex-shrink-0 w-64 group"
              >
                <div className="relative aspect-[4/3] bg-sand mb-3 overflow-hidden">
                  {story.heroImage && (
                    <Image
                      src={story.heroImage}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <h4 className="font-display text-lg group-hover:text-accent transition-colors">
                  {story.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

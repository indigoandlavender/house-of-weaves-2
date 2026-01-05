"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Story } from "@/lib/sheets";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg";

// Region to coordinates mapping for textile origins
const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  // Mediterranean & Europe
  "Sardinia": { lat: 40.1209, lng: 9.0129 },
  "Italy": { lat: 41.8719, lng: 12.5674 },
  "Greece": { lat: 39.0742, lng: 21.8243 },
  "Scandinavia": { lat: 60.1282, lng: 18.6435 },
  "Vikings": { lat: 59.9139, lng: 10.7522 },
  "Byzantine": { lat: 41.0082, lng: 28.9784 },
  "Constantinople": { lat: 41.0082, lng: 28.9784 },
  
  // Middle East & Anatolia
  "Anatolia": { lat: 38.9637, lng: 35.2433 },
  "Turkey": { lat: 38.9637, lng: 35.2433 },
  "Persia": { lat: 32.4279, lng: 53.6880 },
  "Iran": { lat: 32.4279, lng: 53.6880 },
  "Levant": { lat: 33.8886, lng: 35.4955 },
  "Lebanon": { lat: 33.8547, lng: 35.8623 },
  "Phoenicia": { lat: 33.8547, lng: 35.8623 },
  
  // Central Asia
  "Central Asia": { lat: 41.3775, lng: 64.5853 },
  "Uzbekistan": { lat: 41.3775, lng: 64.5853 },
  "Silk Road": { lat: 39.4699, lng: 75.9891 },
  "Caucasus": { lat: 42.3154, lng: 43.3569 },
  "Armenia": { lat: 40.0691, lng: 45.0382 },
  "Azerbaijan": { lat: 40.1431, lng: 47.5769 },
  
  // East Asia
  "China": { lat: 35.8617, lng: 104.1954 },
  "Han Dynasty": { lat: 34.3416, lng: 108.9398 },
  "Japan": { lat: 36.2048, lng: 138.2529 },
  "Korea": { lat: 35.9078, lng: 127.7669 },
  
  // South Asia
  "India": { lat: 20.5937, lng: 78.9629 },
  "Kashmir": { lat: 33.7782, lng: 76.5762 },
  "Pakistan": { lat: 30.3753, lng: 69.3451 },
  
  // Southeast Asia
  "Indonesia": { lat: -0.7893, lng: 113.9213 },
  "Vietnam": { lat: 14.0583, lng: 108.2772 },
  
  // Africa
  "Morocco": { lat: 31.7917, lng: -7.0926 },
  "North Africa": { lat: 28.0339, lng: 1.6596 },
  "Egypt": { lat: 26.8206, lng: 30.8025 },
  "West Africa": { lat: 12.8628, lng: -7.9892 },
  "Mali": { lat: 17.5707, lng: -3.9962 },
  "Ghana": { lat: 7.9465, lng: -1.0232 },
  "Nigeria": { lat: 9.0820, lng: 8.6753 },
  "Ethiopia": { lat: 9.1450, lng: 40.4897 },
  
  // Americas
  "Peru": { lat: -9.1900, lng: -75.0152 },
  "Andes": { lat: -13.5320, lng: -71.9675 },
  "Nazca": { lat: -14.8309, lng: -74.9394 },
  "North America": { lat: 43.0, lng: -102.0 },
  "Lakota": { lat: 43.8554, lng: -102.3397 },
  "Navajo": { lat: 36.0672, lng: -109.1880 },
  "Mexico": { lat: 23.6345, lng: -102.5528 },
  
  // Pacific
  "Pacific": { lat: -17.7134, lng: -149.4068 },
  "Polynesia": { lat: -17.6797, lng: -149.4068 },
  "Tonga": { lat: -21.1790, lng: -175.1982 },
  "Samoa": { lat: -13.7590, lng: -172.1046 },
  "Fiji": { lat: -17.7134, lng: 178.0650 },
  
  // General/Global
  "Mediterranean": { lat: 35.0, lng: 18.0 },
  "Global": { lat: 20.0, lng: 0.0 },
};

// Get coordinates for a region, with fallback
function getRegionCoords(region: string): { lat: number; lng: number } | null {
  if (!region) return null;
  
  // Direct match
  if (REGION_COORDS[region]) {
    return REGION_COORDS[region];
  }
  
  // Try to find partial match
  const regionLower = region.toLowerCase();
  for (const [key, coords] of Object.entries(REGION_COORDS)) {
    if (key.toLowerCase().includes(regionLower) || regionLower.includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
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
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

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
          center: [30, 25], // Center on Middle East/Mediterranean
          zoom: 2,
          attributionControl: false,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.current.on("load", () => {
          setMapLoaded(true);

          // Add markers for each story with a region
          stories.forEach((story) => {
            const coords = getRegionCoords(story.region);
            if (!coords) return;

            // Create custom marker element
            const el = document.createElement("div");
            el.className = "story-marker";
            el.innerHTML = `
              <div class="w-4 h-4 bg-accent rounded-full border-2 border-cream shadow-lg cursor-pointer hover:scale-125 transition-transform" />
            `;
            el.style.cursor = "pointer";

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
              setHoveredMarker(story.slug);
            });

            el.addEventListener("mouseleave", () => {
              setHoveredMarker(null);
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

  // Stories without regions (will show in sidebar)
  const storiesWithRegion = stories.filter((s) => getRegionCoords(s.region));
  const storiesWithoutRegion = stories.filter((s) => !getRegionCoords(s.region));

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
              className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors"
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
                {selectedStory.region || selectedStory.category}
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
            {storiesWithRegion.length} stories mapped
          </p>
        </div>
      </div>

      {/* Stories without region - horizontal scroll */}
      {storiesWithoutRegion.length > 0 && (
        <div className="border-t border-charcoal/10 py-8 px-6">
          <p className="text-meta uppercase tracking-extra-wide text-stone mb-4">
            Additional Stories
          </p>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {storiesWithoutRegion.map((story) => (
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

      {/* Custom marker styles */}
      <style jsx global>{`
        .story-marker > div {
          background-color: #8b4513;
          border-color: #FAF9F7;
        }
        .story-marker:hover > div {
          transform: scale(1.25);
        }
        .mapboxgl-ctrl-attrib {
          display: none;
        }
      `}</style>
    </div>
  );
}

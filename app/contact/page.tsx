"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

// Marrakech coordinates
const MARRAKECH_COORDS = {
  lng: -7.9811,
  lat: 31.6295,
};

const MAPBOX_TOKEN = "pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const pieceSlug = searchParams.get("piece");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: pieceSlug ? `Inquiry: ${pieceSlug}` : "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  // Map state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (pieceSlug) {
      setFormData((prev) => ({
        ...prev,
        subject: `Inquiry about piece: ${pieceSlug}`,
        message: `I am interested in learning more about "${pieceSlug}".\n\n`,
      }));
    }
  }, [pieceSlug]);

  // Initialize Mapbox
  useEffect(() => {
    // Check for WebGL support (required for Mapbox)
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setMapError(true);
      return;
    }

    // Dynamically load Mapbox
    const loadMapbox = async () => {
      try {
        // @ts-ignore
        const mapboxgl = (await import('mapbox-gl')).default;
        
        if (!mapContainer.current || map.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [MARRAKECH_COORDS.lng, MARRAKECH_COORDS.lat],
          zoom: 12,
          attributionControl: false,
        });

        // Add marker
        new mapboxgl.Marker({ color: '#8b4513' })
          .setLngLat([MARRAKECH_COORDS.lng, MARRAKECH_COORDS.lat])
          .addTo(map.current);

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
          setMapLoaded(true);
        });

        map.current.on('error', () => {
          setMapError(true);
        });
      } catch (err) {
        console.error('Mapbox failed to load:', err);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again or email us directly at hello@houseofweaves.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Mapbox CSS */}
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
        rel="stylesheet"
      />
      
      <main className="min-h-screen bg-cream">
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 border-b border-charcoal/10">
          <div className="max-w-[1400px] mx-auto px-6">
            <p className="text-meta uppercase tracking-extra-wide text-stone mb-4">Contact</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1]">
              Get in Touch
            </h1>
            <p className="mt-6 font-body text-lg text-charcoal/70 max-w-2xl">
              Questions about our research? Interested in a piece from the collection? 
              Collaboration proposals? We'd be glad to hear from you.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left - Form */}
              <div>
                {submitted ? (
                  <div className="py-12">
                    <h3 className="font-display text-2xl font-medium mb-4">
                      Thank you for your message.
                    </h3>
                    <p className="font-body text-charcoal/70">
                      We typically respond within 48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-body text-sm">
                        {error}
                      </div>
                    )}
                    
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-meta uppercase tracking-extra-wide text-stone mb-4">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          required
                          className="w-full border-b-2 border-charcoal/20 bg-transparent py-3 font-body text-lg focus:outline-none focus:border-charcoal transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-meta uppercase tracking-extra-wide text-stone mb-4">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="w-full border-b-2 border-charcoal/20 bg-transparent py-3 font-body text-lg focus:outline-none focus:border-charcoal transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-meta uppercase tracking-extra-wide text-stone mb-4">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full border-b-2 border-charcoal/20 bg-transparent py-3 font-body text-lg focus:outline-none focus:border-charcoal transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-meta uppercase tracking-extra-wide text-stone mb-4">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full border-b-2 border-charcoal/20 bg-transparent py-3 font-body text-lg focus:outline-none focus:border-charcoal transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-meta uppercase tracking-extra-wide text-stone mb-4">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        required
                        className="w-full border-b-2 border-charcoal/20 bg-transparent py-3 font-body text-lg focus:outline-none focus:border-charcoal transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-block bg-charcoal text-cream px-10 py-4 font-body text-sm tracking-wide hover:bg-charcoal/80 transition-colors disabled:opacity-50"
                      >
                        {submitting ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right - Map + Info */}
              <div className="space-y-8">
                {/* Map Container */}
                <div className="relative aspect-[4/3] bg-sand overflow-hidden">
                  {mapError ? (
                    /* Fallback for older browsers */
                    <div className="absolute inset-0 flex items-center justify-center bg-sand">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 text-stone">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                        </div>
                        <p className="font-display text-lg text-charcoal mb-2">Marrakech, Morocco</p>
                        <p className="font-body text-sm text-charcoal/60">
                          31.6295° N, 7.9811° W
                        </p>
                        <a 
                          href={`https://www.google.com/maps?q=${MARRAKECH_COORDS.lat},${MARRAKECH_COORDS.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-accent font-body text-sm underline underline-offset-2 hover:no-underline"
                        >
                          View on Google Maps →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        ref={mapContainer} 
                        className="absolute inset-0"
                        style={{ minHeight: '300px' }}
                      />
                      {!mapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-sand">
                          <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="p-6 bg-sand">
                    <h3 className="text-meta uppercase tracking-extra-wide text-stone mb-3">Location</h3>
                    <p className="font-body text-charcoal">Marrakech</p>
                    <p className="font-body text-charcoal/70">Morocco</p>
                  </div>

                  {/* Email */}
                  <div className="p-6 bg-sand">
                    <h3 className="text-meta uppercase tracking-extra-wide text-stone mb-3">Email</h3>
                    <a 
                      href="mailto:hello@houseofweaves.com"
                      className="font-body text-charcoal hover:text-accent transition-colors"
                    >
                      hello@houseofweaves.com
                    </a>
                  </div>
                </div>

                {/* Additional Note */}
                <div className="p-6 bg-sand">
                  <h3 className="text-meta uppercase tracking-extra-wide text-stone mb-3">Response Time</h3>
                  <p className="font-body text-charcoal/80 leading-relaxed">
                    We typically respond to inquiries within 48 hours. For urgent matters 
                    regarding piece acquisitions, please indicate this in your subject line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

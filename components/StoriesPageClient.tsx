"use client";

import { useState } from "react";
import StoryCard from "@/components/StoryCard";
import StoriesMapView from "@/components/StoriesMapView";
import { Story } from "@/lib/sheets";

interface StoriesPageClientProps {
  stories: Story[];
}

export default function StoriesPageClient({ stories }: StoriesPageClientProps) {
  const [view, setView] = useState<"grid" | "map">("grid");

  return (
    <>
      {/* View Toggle */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => setView("grid")}
          className={`flex items-center gap-2 px-4 py-2 text-meta uppercase tracking-extra-wide transition-colors ${
            view === "grid"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-stone hover:text-charcoal"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="6" height="6" />
            <rect x="9" y="1" width="6" height="6" />
            <rect x="1" y="9" width="6" height="6" />
            <rect x="9" y="9" width="6" height="6" />
          </svg>
          Grid
        </button>
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-2 px-4 py-2 text-meta uppercase tracking-extra-wide transition-colors ${
            view === "map"
              ? "text-charcoal border-b-2 border-charcoal"
              : "text-stone hover:text-charcoal"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1C5.24 1 3 3.24 3 6c0 4.5 5 9 5 9s5-4.5 5-9c0-2.76-2.24-5-5-5z" />
            <circle cx="8" cy="6" r="2" />
          </svg>
          Map
        </button>
      </div>

      {/* Content */}
      {view === "grid" ? (
        stories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-body text-charcoal/50">Stories coming soon.</p>
          </div>
        )
      ) : (
        <div className="-mx-6 md:-mx-0">
          <StoriesMapView stories={stories} />
        </div>
      )}
    </>
  );
}

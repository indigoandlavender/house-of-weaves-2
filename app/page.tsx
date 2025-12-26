'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Story {
  slug: string
  title: string
  subtitle?: string
  category?: string
  heroImage?: string
  order?: string
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stories')
      .then((r) => r.json())
      .then((data) => {
        const sortedStories = (data.stories || []).sort(
          (a: Story, b: Story) => (Number(a.order) || 999) - (Number(b.order) || 999)
        )
        setStories(sortedStories)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = document.getElementById('stories-carousel')
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <h1 className="font-display text-hero font-semibold leading-[0.9] tracking-tight max-w-4xl">
            A Textile Archive
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed">
            Rugs and textiles from around the world. The history, the craft, 
            the stories woven into every thread.
          </p>
          <div className="mt-10 flex gap-4">
            <Link 
              href="/stories"
              className="inline-block px-6 py-3 bg-foreground text-cream text-sm tracking-wide hover:bg-foreground/80 transition-colors"
            >
              Read Stories
            </Link>
            <Link 
              href="/about"
              className="inline-block px-6 py-3 border border-foreground text-foreground text-sm tracking-wide hover:bg-foreground hover:text-cream transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </section>

      {/* Stories Carousel */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-meta uppercase tracking-wider text-foreground/50 mb-2">Reading</p>
              <h2 className="font-display text-title font-semibold">Stories</h2>
            </div>
            <Link 
              href="/stories" 
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              All stories →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : stories.length > 0 ? (
            <div className="relative">
              {/* Carousel navigation */}
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-cream border border-foreground/20 rounded-full hover:bg-sand transition-colors hidden md:flex items-center justify-center"
                aria-label="Previous stories"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="12,4 6,10 12,16" />
                </svg>
              </button>

              <button
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-cream border border-foreground/20 rounded-full hover:bg-sand transition-colors hidden md:flex items-center justify-center"
                aria-label="Next stories"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="8,4 14,10 8,16" />
                </svg>
              </button>

              {/* Carousel container */}
              <div
                id="stories-carousel"
                className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              >
                {stories.map((story) => (
                  <Link
                    key={story.slug}
                    href={`/story/${story.slug}`}
                    className="group flex-shrink-0 w-[280px] md:w-[300px] snap-start"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-sand mb-4">
                      {story.heroImage ? (
                        <Image
                          src={story.heroImage}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-sand to-foreground/5" />
                      )}
                    </div>
                    {story.category && (
                      <p className="text-meta uppercase tracking-wider text-foreground/50 mb-2">
                        {story.category}
                      </p>
                    )}
                    <h3 className="font-display text-xl font-medium group-hover:text-accent transition-colors">
                      {story.title}
                    </h3>
                    {story.subtitle && (
                      <p className="text-sm text-foreground/60 mt-1 italic line-clamp-2">
                        {story.subtitle}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-foreground/50 py-12">Stories coming soon.</p>
          )}
        </div>
      </section>
    </main>
  )
}

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
        // Only take first 3 stories for homepage
        setStories(sortedStories.slice(0, 3))
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

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

      {/* Stories Grid - 3 cards */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-meta uppercase tracking-wider text-foreground/50 mb-2">Reading</p>
              <h2 className="font-display text-title font-semibold">Stories</h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : stories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stories.map((story) => (
                  <Link
                    key={story.slug}
                    href={`/story/${story.slug}`}
                    className="group"
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
              
              {/* View All Stories link */}
              <div className="mt-12 text-center">
                <Link 
                  href="/stories" 
                  className="inline-block px-8 py-3 border border-foreground text-foreground text-sm tracking-wide hover:bg-foreground hover:text-cream transition-colors"
                >
                  View all stories →
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-foreground/50 py-12">Stories coming soon.</p>
          )}
        </div>
      </section>
    </main>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getStories } from '@/lib/sheets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const stories = await getStories()
  const featuredStories = stories
    .filter((s) => {
      const f = String(s.featured || '').toLowerCase().trim()
      return f === 'true' || f === 'yes' || f === '1'
    })
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999))
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      
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

      {/* Stories */}
      {featuredStories.length > 0 && (
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStories.map((story) => (
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
                    <p className="text-sm text-foreground/60 mt-1 italic">
                      {story.subtitle}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 md:py-28 bg-charcoal text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-meta uppercase tracking-wider text-white/40 mb-4">Newsletter</p>
            <h2 className="font-display text-title font-semibold mb-4">
              From the Loom
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Occasional notes on textiles, new acquisitions, and stories from the archive. 
              No spam. Unsubscribe anytime.
            </p>
            <form className="flex gap-4 flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-white/60"
              />
              <button 
                type="submit"
                className="px-8 py-3 bg-accent text-white text-sm tracking-wide hover:bg-accent/80 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-meta uppercase tracking-wider text-foreground/50 mb-4">About</p>
          <h1 className="font-display text-hero font-semibold leading-[0.9] tracking-tight max-w-3xl">
            The Archive
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <div className="prose text-foreground/80">
              <p className="text-xl leading-relaxed mb-8">
                House of Weaves is a living archive documenting the world's textile traditions. 
                We trace the threads that connect cultures across time and geography — from the 
                geometric precision of Moroccan Berber rugs to the silk roads of Central Asia, 
                from the indigo traditions of West Africa to the prayer rugs of Anatolia.
              </p>

              <h2 className="font-display text-2xl font-semibold mt-12 mb-4">The Collection</h2>
              <p className="leading-relaxed mb-6">
                Our collection spans centuries and continents. Some pieces are available for 
                acquisition — carefully selected rugs and textiles that we believe deserve 
                new homes with people who will appreciate their history and craftsmanship.
              </p>
              <p className="leading-relaxed mb-6">
                Most pieces in the archive, however, are here simply to be documented. 
                They belong to museums, private collections, or exist only in historical 
                records. We catalog them because the knowledge matters — because understanding 
                how a 16th century Safavid carpet was constructed, or why Tuareg leatherwork 
                uses particular geometric patterns, enriches our understanding of human creativity.
              </p>

              <h2 className="font-display text-2xl font-semibold mt-12 mb-4">The Essays</h2>
              <p className="leading-relaxed mb-6">
                Our essays explore the history, craft, and culture of textiles. We write about 
                the people who make them, the techniques they use, and the traditions they carry 
                forward. We draw on academic research, firsthand observation, and conversations 
                with weavers, collectors, and scholars.
              </p>
              <p className="leading-relaxed mb-6">
                Every claim is sourced. We cite our references because this is documentation, 
                not decoration. The stories are fascinating enough without embellishment.
              </p>

              <h2 className="font-display text-2xl font-semibold mt-12 mb-4">The Approach</h2>
              <p className="leading-relaxed mb-6">
                We don't sell urgency. We don't offer discounts. We don't chase trends.
              </p>
              <p className="leading-relaxed mb-6">
                If you're looking for a rug to fill a space quickly, there are faster options. 
                If you're looking for something with history, something that connects you to 
                centuries of human craftsmanship, something worth passing down — we might have 
                what you're looking for.
              </p>
              <p className="leading-relaxed">
                House of Weaves is based in Marrakech, Morocco.
              </p>
            </div>

            <div className="mt-16 pt-8 border-t border-foreground/10">
              <Link 
                href="/contact"
                className="inline-block px-6 py-3 bg-foreground text-cream text-sm tracking-wide hover:bg-foreground/80 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

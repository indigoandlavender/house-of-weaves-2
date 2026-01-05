import { Metadata } from 'next';
import Link from 'next/link'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofweaves.com';

export const metadata: Metadata = {
  title: 'About',
  description: 'House of Weaves is an independent research archive documenting the history, craft, and cultural significance of carpets and textiles from around the world.',
  openGraph: {
    title: 'About | House of Weaves',
    description: 'An independent research archive documenting the history, craft, and cultural significance of carpets and textiles.',
    url: `${siteUrl}/about`,
    siteName: 'House of Weaves',
    locale: 'en_GB',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-charcoal/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-meta uppercase tracking-extra-wide text-stone mb-4">About the Archive</p>
          <h1 className="font-display text-hero font-medium leading-[0.9] tracking-tight max-w-4xl">
            Documenting the World's Textile Heritage
          </h1>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 border-b border-charcoal/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl">
            <p className="font-body text-xl md:text-2xl leading-relaxed text-charcoal/80">
              House of Weaves is an independent research archive dedicated to documenting the history, 
              craft, and cultural significance of carpets and textiles. We trace the threads that connect 
              civilizations across time and geography — from the geometric precision of Amazigh weavers 
              in the Atlas Mountains to the silk traditions of the Silk Road, from the indigo cultures 
              of West Africa to the prayer rugs of Anatolia.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="space-y-16">
                {/* The Archive */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">The Archive</h2>
                  <div className="font-body text-lg leading-relaxed text-charcoal/80 space-y-6">
                    <p>
                      Our archive comprises original research, field documentation, and scholarly essays 
                      covering textile traditions from over forty countries. Each entry draws on academic 
                      sources, museum collections, and firsthand observation from artisan communities.
                    </p>
                    <p>
                      We document not only the technical aspects of production — fiber, dye, loom, knot — 
                      but the cultural contexts in which textiles function as currency, as dowry, as prayer, 
                      as protection, as identity. A carpet is never merely decorative. It is compressed 
                      knowledge, portable wealth, and often the most valuable object a family owns.
                    </p>
                    <p>
                      Every claim in our archive is sourced. We cite our references because this is 
                      documentation, not decoration. The stories are remarkable enough without embellishment.
                    </p>
                  </div>
                </div>

                {/* Research Methodology */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">Methodology</h2>
                  <div className="font-body text-lg leading-relaxed text-charcoal/80 space-y-6">
                    <p>
                      Our research methodology distinguishes between evidence types. We label each story 
                      by its source category — archaeological, ethnographic, oral tradition, or folk belief — 
                      so readers understand what kind of truth they are encountering.
                    </p>
                    <p>
                      <span className="font-bold text-charcoal">Living Biological History</span> denotes 
                      traditions verified by peer-reviewed science and still practiced today. 
                      <span className="font-bold text-charcoal"> Archaeological Evidence</span> refers 
                      to physical artifacts, excavations, and material analysis. 
                      <span className="font-bold text-charcoal"> Ethnographic Documentation</span> draws 
                      on fieldwork, interviews, and participant observation. 
                      <span className="font-bold text-charcoal"> Oral Tradition</span> preserves knowledge 
                      transmitted through generations of practitioners.
                    </p>
                    <p>
                      This transparency matters. When a weaver tells us that a particular motif protects 
                      against the evil eye, we document it as lived belief — valuable ethnographic data — 
                      without claiming it as scientific fact.
                    </p>
                  </div>
                </div>

                {/* The Collection */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">The Collection</h2>
                  <div className="font-body text-lg leading-relaxed text-charcoal/80 space-y-6">
                    <p>
                      House of Weaves maintains a physical collection of carpets and textiles, primarily 
                      from Morocco, Central Asia, and Anatolia. Some pieces are available for acquisition 
                      through our sister site, <Link href="https://tilwen.com" className="text-accent underline underline-offset-2 hover:no-underline">Tilwen</Link>. Others remain in the archive for 
                      documentation purposes only.
                    </p>
                    <p>
                      We also catalog pieces held in museum collections and private holdings worldwide. 
                      Our goal is comprehensive documentation — understanding how a 16th-century Safavid 
                      carpet was constructed enriches knowledge regardless of where the physical object resides.
                    </p>
                  </div>
                </div>

                {/* Editorial Independence */}
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">Editorial Independence</h2>
                  <div className="font-body text-lg leading-relaxed text-charcoal/80 space-y-6">
                    <p>
                      House of Weaves operates as an independent research initiative. We have no 
                      institutional affiliations, accept no advertising, and maintain complete editorial 
                      independence. Our work is funded through the sale of authenticated pieces and 
                      direct support from readers who value this documentation.
                    </p>
                    <p>
                      We believe that traditional knowledge systems deserve the same rigorous documentation 
                      applied to any field of study. A carpet that took a woman six months to weave, 
                      encoding patterns her grandmother taught her, deserves more than a casual caption.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-10">
                {/* Location */}
                <div className="p-8 bg-sand">
                  <h3 className="text-meta uppercase tracking-extra-wide text-stone mb-4">Location</h3>
                  <p className="font-body text-lg text-charcoal">
                    Marrakech, Morocco
                  </p>
                  <p className="font-body text-charcoal/60 mt-2">
                    Field research across North Africa, Central Asia, and the Middle East
                  </p>
                </div>

                {/* Contact */}
                <div className="p-8 bg-sand">
                  <h3 className="text-meta uppercase tracking-extra-wide text-stone mb-4">Inquiries</h3>
                  <p className="font-body text-charcoal/80 mb-4">
                    For research inquiries, collection access, or collaboration proposals.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-block text-accent font-body underline underline-offset-2 hover:no-underline"
                  >
                    Contact Us →
                  </Link>
                </div>

                {/* Related */}
                <div className="p-8 bg-sand">
                  <h3 className="text-meta uppercase tracking-extra-wide text-stone mb-4">Related</h3>
                  <ul className="space-y-3 font-body">
                    <li>
                      <Link 
                        href="https://tilwen.com" 
                        className="text-charcoal/80 hover:text-accent transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Tilwen — Moroccan Rugs
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="https://dancingwithlions.com" 
                        className="text-charcoal/80 hover:text-accent transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Dancing with Lions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-sand">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
            Explore the Archive
          </h2>
          <p className="font-body text-lg text-charcoal/70 max-w-2xl mx-auto mb-10">
            Browse our collection of essays documenting textile traditions from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/stories"
              className="inline-block px-8 py-4 bg-charcoal text-cream font-body text-sm tracking-wide hover:bg-charcoal/80 transition-colors"
            >
              Read Stories
            </Link>
            <Link 
              href="/contact"
              className="inline-block px-8 py-4 border border-charcoal text-charcoal font-body text-sm tracking-wide hover:bg-charcoal hover:text-cream transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

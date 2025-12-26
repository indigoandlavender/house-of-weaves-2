import Link from 'next/link'
import Image from 'next/image'
import { getCollectionPieces } from '@/lib/sheets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CollectionPage() {
  const pieces = await getCollectionPieces()

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-meta uppercase tracking-wider text-foreground/50 mb-4">The Collection</p>
          <h1 className="font-display text-hero font-semibold leading-[0.9] tracking-tight">
            Available Pieces
          </h1>
          <p className="mt-6 text-xl text-foreground/60 max-w-2xl">
            Selected rugs and textiles available for acquisition. 
            Each piece comes with full documentation of its history and provenance.
          </p>
        </div>
      </section>

      {/* Pieces Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          {pieces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">
                No pieces currently available.
              </p>
              <Link 
                href="/archive" 
                className="text-accent hover:underline underline-offset-4"
              >
                Browse the archive →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {pieces.map((piece) => (
                <Link 
                  key={piece.slug} 
                  href={`/piece/${piece.slug}`}
                  className="group piece-card"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-sand mb-4">
                    {piece.heroImage ? (
                      <Image
                        src={piece.heroImage}
                        alt={piece.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-sand to-foreground/5" />
                    )}
                  </div>
                  <h3 className="font-display text-xl font-medium group-hover:text-accent transition-colors">
                    {piece.title}
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    {piece.origin}{piece.period ? `, ${piece.period}` : ''}
                  </p>
                  {piece.dimensions && (
                    <p className="text-sm text-foreground/40 mt-1">
                      {piece.dimensions}
                    </p>
                  )}
                  {piece.price && (
                    <p className="text-lg font-medium text-accent mt-3">
                      {piece.currency || '€'}{piece.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Note */}
      <section className="py-16 bg-sand">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Interested in a piece?
          </h2>
          <p className="text-foreground/60 mb-6 max-w-xl mx-auto">
            Contact us to learn more about any piece in our collection. 
            We provide detailed condition reports and additional photographs upon request.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-6 py-3 bg-foreground text-cream text-sm tracking-wide hover:bg-foreground/80 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPieceBySlug, getPieceImages, getPieces } from '@/lib/sheets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const pieces = await getPieces()
  return pieces.map((piece) => ({ slug: piece.slug }))
}

export default async function PiecePage({ params }: PageProps) {
  const piece = await getPieceBySlug(params.slug)
  
  if (!piece) {
    notFound()
  }

  const images = await getPieceImages(params.slug)
  const isAvailable = piece.available === 'true' || piece.available === 'yes' || piece.available === '1'

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      
      {/* Back Link */}
      <div className="pt-24 md:pt-28">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link 
            href="/archive" 
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="10,2 4,8 10,14" />
            </svg>
            Back to Archive
          </Link>
        </div>
      </div>

      {/* Piece Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[4/5] relative overflow-hidden bg-sand">
                {piece.heroImage ? (
                  <Image
                    src={piece.heroImage}
                    alt={piece.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sand to-foreground/5" />
                )}
              </div>
              
              {/* Additional Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="aspect-square relative overflow-hidden bg-sand">
                      <Image
                        src={img.image_url}
                        alt={img.caption || `${piece.title} detail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              {isAvailable && (
                <span className="inline-block px-3 py-1 bg-accent text-white text-xs tracking-wide mb-4">
                  Available for Acquisition
                </span>
              )}
              
              <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-2">
                {piece.title}
              </h1>
              
              {piece.subtitle && (
                <p className="text-xl text-foreground/60 italic mb-6">
                  {piece.subtitle}
                </p>
              )}

              {/* Specifications */}
              <div className="border-t border-foreground/10 pt-6 space-y-4">
                {piece.origin && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Origin</span>
                    <span className="text-sm text-foreground">{piece.origin}</span>
                  </div>
                )}
                {piece.region && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Region</span>
                    <span className="text-sm text-foreground">{piece.region}</span>
                  </div>
                )}
                {piece.period && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Period</span>
                    <span className="text-sm text-foreground">{piece.period}</span>
                  </div>
                )}
                {piece.circa && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Date</span>
                    <span className="text-sm text-foreground">{piece.circa}</span>
                  </div>
                )}
                {piece.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Dimensions</span>
                    <span className="text-sm text-foreground">{piece.dimensions}</span>
                  </div>
                )}
                {piece.materials && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Materials</span>
                    <span className="text-sm text-foreground">{piece.materials}</span>
                  </div>
                )}
                {piece.technique && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Technique</span>
                    <span className="text-sm text-foreground">{piece.technique}</span>
                  </div>
                )}
                {piece.condition && (
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/50 uppercase tracking-wide">Condition</span>
                    <span className="text-sm text-foreground">{piece.condition}</span>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              {isAvailable && piece.price && (
                <div className="border-t border-foreground/10 pt-6 mt-6">
                  <p className="text-2xl font-display font-semibold text-accent mb-4">
                    {piece.currency || '€'}{piece.price}
                  </p>
                  <Link 
                    href={`/contact?piece=${piece.slug}`}
                    className="inline-block w-full text-center px-6 py-4 bg-foreground text-cream text-sm tracking-wide hover:bg-foreground/80 transition-colors"
                  >
                    Inquire About This Piece
                  </Link>
                </div>
              )}

              {!isAvailable && (
                <div className="border-t border-foreground/10 pt-6 mt-6">
                  <p className="text-sm text-foreground/50 mb-4">
                    This piece is part of the archive and not currently available for acquisition.
                  </p>
                  <Link 
                    href="/collection"
                    className="text-sm text-accent hover:underline underline-offset-4"
                  >
                    View available pieces →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description & Provenance */}
      {(piece.description || piece.provenance || piece.notes) && (
        <section className="py-16 bg-sand">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="max-w-3xl">
              {piece.description && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl font-semibold mb-4">About This Piece</h2>
                  <div className="prose text-foreground/80 whitespace-pre-line">
                    {piece.description}
                  </div>
                </div>
              )}
              
              {piece.provenance && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl font-semibold mb-4">Provenance</h2>
                  <div className="prose text-foreground/80 whitespace-pre-line">
                    {piece.provenance}
                  </div>
                </div>
              )}
              
              {piece.notes && (
                <div>
                  <h2 className="font-display text-2xl font-semibold mb-4">Notes</h2>
                  <div className="prose text-foreground/80 whitespace-pre-line">
                    {piece.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

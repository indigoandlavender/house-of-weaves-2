import Link from 'next/link'
import Image from 'next/image'
import { getArchivePieces } from '@/lib/sheets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArchivePage() {
  const pieces = await getArchivePieces()
  
  // Group pieces by origin for display
  const piecesByOrigin = pieces.reduce((acc, piece) => {
    const origin = piece.origin || 'Unknown'
    if (!acc[origin]) acc[origin] = []
    acc[origin].push(piece)
    return acc
  }, {} as Record<string, typeof pieces>)

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-meta uppercase tracking-wider text-foreground/50 mb-4">The Archive</p>
          <h1 className="font-display text-hero font-semibold leading-[0.9] tracking-tight">
            Documented Pieces
          </h1>
          <p className="mt-6 text-xl text-foreground/60 max-w-2xl">
            A growing catalog of rugs and textiles from around the world. 
            Each piece documented with its history, provenance, and cultural context.
          </p>
        </div>
      </section>

      {/* Pieces Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          {pieces.length === 0 ? (
            <p className="text-center text-foreground/60 py-12">
              The archive is being prepared. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                    {piece.available === 'true' || piece.available === 'yes' || piece.available === '1' ? (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-accent text-white text-xs tracking-wide">
                        Available
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display text-lg font-medium group-hover:text-accent transition-colors line-clamp-2">
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

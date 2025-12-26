import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLegalPage } from '@/lib/nexus'

interface LegalPageProps {
  templateId: string
}

export default async function LegalPageContent({ templateId }: LegalPageProps) {
  const page = await getLegalPage(templateId)

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      
      <article className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-display text-4xl font-semibold tracking-tight mb-12">{page.title}</h1>
          
          <div className="space-y-8 text-foreground/80">
            {page.sections.map((section, index) => (
              <section key={index}>
                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">{section.title}</h2>
                <p className="leading-relaxed whitespace-pre-line">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}

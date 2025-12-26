import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getStories, getStoryBySlug, getStoryImages } from '@/lib/sheets';
import StoryBody from '@/components/StoryBody';
import Gallery from '@/components/Gallery';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofweaves.com';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const story = await getStoryBySlug(params.slug);
  if (!story) return { title: 'Story Not Found' };
  
  const title = `${story.title} | House of Weaves`;
  const description = story.excerpt || story.subtitle || `Read about ${story.title} in this essay exploring the history and culture of textiles.`;
  const url = `${siteUrl}/story/${story.slug}`;
  
  return {
    title: story.title,
    description,
    keywords: story.tags ? story.tags.split(',').map(t => t.trim()) : undefined,
    authors: story.textBy ? [{ name: story.textBy }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'House of Weaves',
      locale: 'en_GB',
      type: 'article',
      images: story.heroImage ? [
        {
          url: story.heroImage,
          width: 1200,
          height: 630,
          alt: story.title,
        }
      ] : undefined,
      article: {
        authors: story.textBy ? [story.textBy] : undefined,
        section: story.category || 'Essays',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: story.heroImage ? [story.heroImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const story = await getStoryBySlug(params.slug);
  
  if (!story) {
    notFound();
  }

  const galleryImages = await getStoryImages(params.slug);

  // Parse sources (separated by ;;)
  const sources = story.sources
    ? story.sources.split(';;').map((s) => s.trim()).filter(Boolean)
    : [];

  // Calculate word count for schema
  const wordCount = story.body ? story.body.split(/\s+/).length : 0;
  
  // Parse read time for schema (e.g., "14 min read" -> "PT14M")
  const readTimeMatch = story.readTime?.match(/(\d+)/);
  const readTimeISO = readTimeMatch ? `PT${readTimeMatch[1]}M` : undefined;

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.excerpt || story.subtitle,
    image: story.heroImage || undefined,
    author: story.textBy ? {
      '@type': 'Person',
      name: story.textBy,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'House of Weaves',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.svg`,
      },
    },
    datePublished: story.year ? `${story.year}-01-01` : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/story/${story.slug}`,
    },
    articleSection: story.category || 'Essays',
    wordCount: wordCount > 0 ? wordCount : undefined,
    timeRequired: readTimeISO,
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Stories',
        item: `${siteUrl}/stories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: story.title,
        item: `${siteUrl}/story/${story.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Image */}
      {story.heroImage && (
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
          {story.heroCaption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="text-white/80 text-sm max-w-4xl mx-auto">
                {story.heroCaption}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Article Header */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-foreground/50 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/stories" className="hover:text-accent transition-colors">Stories</Link></li>
            <li>/</li>
            <li className="text-foreground/70">{story.title}</li>
          </ol>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-foreground/50 mb-6">
          {story.category && (
            <>
              <span className="uppercase tracking-wide">{story.category}</span>
              <span>·</span>
            </>
          )}
          {story.readTime && <span>{story.readTime}</span>}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
          {story.title}
        </h1>

        {/* Subtitle */}
        {story.subtitle && (
          <p className="text-xl text-foreground/70 italic mb-8">
            {story.subtitle}
          </p>
        )}

        <hr className="border-foreground/10 mb-12" />

        {/* Body */}
        <StoryBody content={story.body} />

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <Gallery images={galleryImages} />
          </>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <div className="text-sm text-foreground/60">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-4">Sources</h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Footer */}
        <hr className="border-foreground/10 my-12" />
        <footer className="text-sm text-foreground/50 flex flex-wrap gap-x-4 gap-y-1">
          {story.textBy && <span>Text — {story.textBy}</span>}
          {story.imagesBy && <span>Images — {story.imagesBy}</span>}
          {story.year && <span>{story.year}</span>}
        </footer>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="10,3 5,8 10,13" />
            </svg>
            All Stories
          </Link>
        </div>
      </article>
    </main>
  );
}

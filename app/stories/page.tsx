import { Metadata } from 'next';
import { getStories } from '@/lib/sheets';
import StoryCard from '@/components/StoryCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofweaves.com';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Essays exploring the history, craft, and cultural meaning of carpets and textiles from Persia to Peru, from silk roads to refugee camps.',
  keywords: ['carpet stories', 'textile essays', 'rug history articles', 'weaving culture', 'textile traditions'],
  openGraph: {
    title: 'Stories | House of Weaves',
    description: 'Essays exploring the history, craft, and cultural meaning of carpets and textiles from Persia to Peru, from silk roads to refugee camps.',
    url: `${siteUrl}/stories`,
    siteName: 'House of Weaves',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stories | House of Weaves',
    description: 'Essays exploring the history, craft, and cultural meaning of carpets and textiles.',
  },
  alternates: {
    canonical: `${siteUrl}/stories`,
  },
};

export default async function StoriesPage() {
  const stories = await getStories();
  
  const sortedStories = stories.sort((a, b) => {
    const orderA = parseInt(a.order) || 999;
    const orderB = parseInt(b.order) || 999;
    return orderA - orderB;
  });

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
    ],
  };

  // CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Stories | House of Weaves',
    description: 'Essays exploring the history, craft, and cultural meaning of carpets and textiles.',
    url: `${siteUrl}/stories`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sortedStories.length,
      itemListElement: sortedStories.slice(0, 20).map((story, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/story/${story.slug}`,
        name: story.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Stories
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            The traditions, techniques, and cultures woven into every thread.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {sortedStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedStories.map((story) => (
                <StoryCard key={story.slug} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground/50">Stories coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

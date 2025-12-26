import { getStories } from '@/lib/sheets';
import StoryCard from '@/components/StoryCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Stories | House of Weaves',
  description: 'Stories of textile traditions, techniques, and the cultures that created them.',
};

export default async function StoriesPage() {
  const stories = await getStories();
  
  const sortedStories = stories.sort((a, b) => {
    const orderA = parseInt(a.order) || 999;
    const orderB = parseInt(b.order) || 999;
    return orderA - orderB;
  });

  return (
    <main className="min-h-screen bg-background">
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

import { MetadataRoute } from 'next';
import { getStories, getPieces } from '@/lib/sheets';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofweaves.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all stories
  const stories = await getStories();
  
  // Fetch all pieces
  const pieces = await getPieces();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Story pages
  const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${siteUrl}/story/${story.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Piece pages
  const piecePages: MetadataRoute.Sitemap = pieces.map((piece) => ({
    url: `${siteUrl}/piece/${piece.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...storyPages, ...piecePages];
}

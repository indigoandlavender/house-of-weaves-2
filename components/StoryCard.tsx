import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/sheets';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/story/${story.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-sand">
        {story.heroImage ? (
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sand to-charcoal/5">
            <span className="font-body text-charcoal/20 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {story.category && (
            <span className="text-meta uppercase tracking-extra-wide text-stone">
              {story.category}
            </span>
          )}
          {story.category && story.sourceType && (
            <span className="text-charcoal/30">·</span>
          )}
          {story.sourceType && (
            <span className="text-xs font-body text-charcoal/40">
              {story.sourceType}
            </span>
          )}
        </div>
        <h3 className="font-display text-xl text-charcoal mb-2 group-hover:text-accent transition-colors">
          {story.title}
        </h3>
        {story.subtitle && (
          <p className="font-body text-sm text-charcoal/60 line-clamp-2 italic">
            {story.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

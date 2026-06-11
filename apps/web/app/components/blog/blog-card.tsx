import type { BlogPostWithUser } from "@bip/domain";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { Card } from "~/components/ui/card";
import { formatDateLong } from "~/lib/utils";

interface BlogCardProps {
  blogPost: BlogPostWithUser;
  compact?: boolean;
}

export const formatDate = (date: Date | string | undefined) => (date ? formatDateLong(date) : "No date");

// Function to calculate read time
export const getReadTime = (content: string | undefined | null) => {
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

export function BlogCard({ blogPost, compact = false }: BlogCardProps) {
  const coverImage = blogPost.coverImage || blogPost.imageUrls?.[0];

  return (
    <Link to={`/blog/${blogPost.slug}`} className="block h-full no-underline">
      <Card className="h-full card-premium hover:border-brand-primary/60 transition-all duration-300 overflow-hidden">
        <div className={`relative ${compact ? "h-[300px]" : "h-[400px]"} overflow-hidden`}>
          {coverImage ? (
            <img
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              src={coverImage}
              alt={blogPost.title}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-brand-tertiary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute top-4 left-4 right-4">
            <div className="flex justify-between items-start text-white/80 text-sm">
              <span>{formatDate(blogPost.publishedAt || blogPost.createdAt)}</span>
              <span>by @{blogPost.user.username}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold mb-3 text-white`}>{blogPost.title}</h2>
            {blogPost.blurb && (
              <div className="text-sm text-white/90 line-clamp-4 prose prose-invert prose-sm">
                <Markdown>{blogPost.blurb}</Markdown>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

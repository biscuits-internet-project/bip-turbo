import type { BlogPost } from "@bip/domain";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface BlogCardProps {
  blogPost: BlogPost & {
    coverImage?: string;
  };
  compact?: boolean;
}

// Function to format date
export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
    <Card
      key={blogPost.id}
      className="card-premium overflow-hidden flex flex-col h-full hover:border-brand-tertiary/60 transition-all duration-300"
    >
      {/* Card Header */}
      <CardHeader className={compact ? "p-4 pb-2" : "pb-2"}>
        <div className="flex justify-between items-start">
          <div className="flex items-center text-md text-content-text-secondary">
            <span>{formatDate(blogPost.publishedAt)}</span>
          </div>
        </div>
        <CardTitle className={`${compact ? "text-lg" : "text-xl"} mt-4 text-brand-primary`}>{blogPost.title}</CardTitle>
        {coverImage && (
          <div className="w-full my-3">
            <img
              src={coverImage}
              alt={blogPost.title}
              className={`w-full ${compact ? "h-32" : "h-40"} object-cover rounded-md`}
            />
          </div>
        )}
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow flex flex-col h-full">
        <div className="flex-grow">
          <div className="text-content-text-secondary text-sm">
            <div className="line-clamp-5 prose prose-invert prose-sm">
              <Markdown>{blogPost.blurb}</Markdown>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="btn-secondary w-full mt-4">
          <Link to={`/blog/${blogPost.slug}`} className="w-full">
            Read More
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

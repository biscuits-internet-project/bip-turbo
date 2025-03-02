import type { BlogPost } from "@bip/domain";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface BlogCardProps {
  blogPost: BlogPost;
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
  return (
    <Card
      key={blogPost.id}
      className="bg-gray-900 border-gray-800 overflow-hidden flex flex-col h-full hover:border-gray-700 transition-colors"
    >
      {/* Card Header */}
      <CardHeader className={compact ? "p-4 pb-2" : "pb-2"}>
        <div className="flex justify-between items-start">
          <div className="flex items-center text-md text-gray-400">
            <span>{formatDate(blogPost.publishedAt)}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">{blogPost.postType}</span>
        </div>
        <CardTitle className={`${compact ? "text-lg" : "text-xl"} mt-2 text-white`}>{blogPost.title}</CardTitle>
        {blogPost.imageUrls && blogPost.imageUrls.length > 0 && (
          <div className="w-full my-3">
            <img
              src={blogPost.imageUrls[0]}
              alt={blogPost.title}
              className={`w-full ${compact ? "h-32" : "h-40"} object-cover rounded-md`}
            />
          </div>
        )}
      </CardHeader>

      {/* Card Content */}
      <CardContent className={`flex-grow ${compact ? "p-4 pt-0" : ""}`}>
        {blogPost.blurb && (
          <div className="text-gray-400 text-sm mb-4">
            <div className={`${compact ? "line-clamp-4" : ""} overflow-hidden`}>
              <Markdown>{blogPost.blurb}</Markdown>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end w-full text-xs text-gray-400 mt-4">
          <div className="flex items-center">
            <span className="mr-1">⏱️</span>
            <span>{getReadTime(blogPost.content)}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full mt-4 bg-gray-800 hover:bg-gray-700 border-gray-700">
          <Link to={`/blog/${blogPost.slug}`} className="w-full">
            Read More
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

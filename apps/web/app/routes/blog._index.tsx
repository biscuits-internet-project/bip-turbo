import type { BlogPost } from "@bip/domain";
import Markdown from "react-markdown";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";
interface LoaderData {
  blogPosts: BlogPost[];
}

export const loader = publicLoader<LoaderData>(async () => {
  const blogPosts = await services.blogPosts.findMany({
    sort: [
      {
        field: "createdAt",
        direction: "desc",
      },
    ],
    filters: [
      {
        field: "state",
        operator: "eq",
        value: "published",
      },
      {
        field: "publishedAt",
        operator: "lte",
        value: new Date(),
      },
    ],
  });

  return { blogPosts };
});

export default function BlogPosts() {
  const { blogPosts = [] } = useSerializedLoaderData<LoaderData>();

  // Function to format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to calculate read time (if not available)
  const getReadTime = (content: string | undefined | null) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blog Posts</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((blogPost) => (
            <Card
              key={blogPost.id}
              className="bg-gray-900 border-gray-800 overflow-hidden flex flex-col h-full hover:border-gray-700 transition-colors"
            >
              {/* Card Header */}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center text-md text-gray-400">
                    <span>{formatDate(blogPost.publishedAt)}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">{blogPost.postType}</span>
                </div>
                <CardTitle className="text-xl mt-2 text-white">{blogPost.title}</CardTitle>
                {blogPost.imageUrls && blogPost.imageUrls.length > 0 && (
                  <div className="w-full my-6">
                    <img src={blogPost.imageUrls[0]} alt={blogPost.title} className="w-full h-40 object-cover" />
                  </div>
                )}
              </CardHeader>

              {/* Card Content */}
              <CardContent className="flex-grow">
                <div className="text-gray-400 text-sm mb-4">
                  {blogPost.blurb && <Markdown>{blogPost.blurb}</Markdown>}
                </div>

                <div className="flex items-center justify-end w-full text-xs text-gray-400 mt-4">
                  <div className="flex items-center">
                    <span className="mr-1">⏱️</span>
                    <span>{getReadTime(blogPost.content)}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 bg-gray-800 hover:bg-gray-700 border-gray-700"
                >
                  <a href={`/blog/${blogPost.slug}`} className="w-full">
                    Read More
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

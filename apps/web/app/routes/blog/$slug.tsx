import type { BlogPost } from "@bip/domain";
import { CalendarDays, Pencil, User } from "lucide-react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { AdminOnly } from "~/components/admin/admin-only";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  blogPost: BlogPost & {
    coverImage?: string;
  };
}

export const loader = publicLoader(async ({ params }) => {
  const { slug } = params;
  const blogPost = await services.blogPosts.findBySlug(slug as string);

  if (!blogPost) {
    throw notFound(`Blog post with slug "${slug}" not found`);
  }

  // Get associated files
  const files = await services.files.findByBlogPostId(blogPost.id);
  const coverImage = files.find((file) => file.isCover)?.url;

  return {
    blogPost: {
      ...blogPost,
      coverImage,
    },
  };
});

export default function BlogPostPage() {
  const { blogPost } = useSerializedLoaderData<LoaderData>();

  // Function to format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center gap-2 text-gray-400">
          <CalendarDays className="h-5 w-5" />
          <p className="text-lg">{formatDate(blogPost.publishedAt)}</p>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{blogPost.title}</h1>
          <AdminOnly>
            <Button
              asChild
              variant="outline"
              className="border-purple-800 hover:bg-purple-800/10 text-purple-400 hover:text-purple-300"
            >
              <Link to={`/blog/${blogPost.slug}/edit`} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </AdminOnly>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="text-gray-200">Admin User</p>
            </div>
          </div>
        </div>

        {blogPost.coverImage && (
          <div className="max-w-3xl mx-auto overflow-hidden rounded-lg">
            <div className="aspect-[2/1]">
              <img src={blogPost.coverImage} alt={blogPost.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <Card className="relative overflow-hidden border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />
          <CardContent className="relative z-10 p-6">
            <div className="prose prose-invert max-w-none">
              <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                {blogPost.content}
              </Markdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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

export function meta({ data }: { data: LoaderData }) {
  return [
    { title: `${data.blogPost.title} | Biscuits Internet Project` },
    {
      name: "description",
      content: data.blogPost.blurb || `Read ${data.blogPost.title} on Biscuits Internet Project`,
    },
  ];
}

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
        <div className="flex items-center gap-2 text-content-text-secondary">
          <CalendarDays className="h-5 w-5" />
          <p className="text-lg">{formatDate(blogPost.publishedAt)}</p>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{blogPost.title}</h1>
          <AdminOnly>
            <Button
              asChild
              variant="outline"
              className="border-brand hover:bg-brand/10 text-brand hover:text-hover-accent"
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
              <p className="text-content-text-primary">Admin User</p>
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden border-content-bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-br from-content-bg via-content-bg/95 to-brand/20 pointer-events-none" />
          <CardContent className="relative z-10 p-6">
            <div className="prose prose-invert max-w-none">
              {blogPost.coverImage && (
                <div className="float-right ml-12 mb-8 max-w-[300px] w-full">
                  <img src={blogPost.coverImage} alt={blogPost.title} className="rounded-lg w-full" />
                </div>
              )}
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

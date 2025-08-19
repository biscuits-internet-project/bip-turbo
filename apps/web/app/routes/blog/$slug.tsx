import type { BlogPost } from "@bip/domain";
import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { getBlogMeta, getBlogStructuredData } from "~/lib/seo";
import { services } from "~/server/services";

interface LoaderData {
  blogPost: BlogPost & {
    coverImage?: string;
  };
}

export const loader = publicLoader(async ({ params }) => {
  const { slug } = params;
  const blogPost = await services.blogPosts.findBySlugWithFiles(slug as string);

  if (!blogPost) {
    throw notFound(`Blog post with slug "${slug}" not found`);
  }

  return {
    blogPost,
  };
});

export function meta({ data }: { data: LoaderData }) {
  return getBlogMeta({
    title: data.blogPost.title,
    blurb: data.blogPost.blurb || undefined,
    slug: data.blogPost.slug,
    publishedAt: data.blogPost.publishedAt ? data.blogPost.publishedAt.toISOString() : undefined,
  });
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
    <div className="space-y-6 md:space-y-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getBlogStructuredData({
            title: blogPost.title,
            blurb: blogPost.blurb || undefined,
            slug: blogPost.slug,
            publishedAt: blogPost.publishedAt ? blogPost.publishedAt.toISOString() : undefined,
          }),
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-baseline gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">{blogPost.title}</h1>
          <div className="flex items-center gap-2 text-content-text-secondary">
            <CalendarDays className="h-4 w-4" />
            <span className="text-lg">{formatDate(blogPost.publishedAt)}</span>
          </div>
        </div>
        <AdminOnly>
          <Button asChild variant="outline" className="btn-secondary">
            <Link to={`/blog/${blogPost.slug}/edit`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </AdminOnly>
      </div>

      {/* Subtle back link */}
      <div className="flex justify-start">
        <Link
          to="/blog"
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to blog</span>
        </Link>
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
  );
}

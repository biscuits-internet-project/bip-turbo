import type { BlogPost } from "@bip/domain";
import { CalendarDays, Pencil } from "lucide-react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { AdminOnly } from "~/components/admin/admin-only";
import { Card, CardContent } from "~/components/ui/card";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { getBlogMeta, getBlogStructuredData } from "~/lib/seo";
import { formatDateLong } from "~/lib/utils";
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

      <div className="space-y-2">
        <PageHeader
          title={blogPost.title}
          backLink={{ to: "/blog", label: "All Posts" }}
          actions={
            <AdminOnly>
              <LinkButton to={`/blog/${blogPost.slug}/edit`} icon={Pencil} intent="secondary" iconOnlyOnMobile>
                Edit Post
              </LinkButton>
            </AdminOnly>
          }
        />
        <div className="flex items-center justify-center gap-2 text-content-text-secondary">
          <CalendarDays className="h-4 w-4" />
          <span className="text-lg">{blogPost.publishedAt ? formatDateLong(blogPost.publishedAt) : "No date"}</span>
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
  );
}

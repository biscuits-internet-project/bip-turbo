import type { BlogPostWithUser } from "@bip/domain";
import { Plus } from "lucide-react";
import { AdminOnly } from "~/components/admin/admin-only";
import { BlogCard } from "~/components/blog/blog-card";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getBlogsMeta } from "~/lib/seo";
import { services } from "~/server/services";

interface LoaderData {
  blogPosts: Array<BlogPostWithUser>;
}

export const loader = publicLoader<LoaderData>(async () => {
  const blogPosts = await services.blogPosts.findManyWithUser({
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
    ],
  });

  return { blogPosts };
});

export function meta() {
  return getBlogsMeta();
}

export default function BlogPosts() {
  const { blogPosts = [] } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="BLOG"
        actions={
          <AdminOnly>
            <LinkButton to="/blog/new" icon={Plus} iconOnlyOnMobile>
              Create Post
            </LinkButton>
          </AdminOnly>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((blogPost) => (
          <BlogCard key={blogPost.id} blogPost={blogPost} />
        ))}
      </div>

      {blogPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-content-text-secondary">No blog posts found.</p>
        </div>
      )}
    </div>
  );
}

import type { BlogPost } from "@bip/domain";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { BlogCard } from "~/components/blog/blog-card";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  blogPosts: Array<
    BlogPost & {
      coverImage?: string;
    }
  >;
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
    ],
  });

  // Fetch cover images for all blog posts
  const blogPostsWithCoverImages = await Promise.all(
    blogPosts.map(async (blogPost) => {
      const files = await services.files.findByBlogPostId(blogPost.id);
      const coverImage = files.find((file) => file.isCover)?.url;
      return {
        ...blogPost,
        coverImage,
      };
    }),
  );

  return { blogPosts: blogPostsWithCoverImages };
});

export function meta() {
  return [
    { title: "Blog | Biscuits Internet Project" },
    {
      name: "description",
      content: "Read the latest news, stories, and updates from the Biscuits Internet Project.",
    },
  ];
}

export default function BlogPosts() {
  const { blogPosts = [] } = useSerializedLoaderData<LoaderData>();

  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blog Posts</h1>
          <AdminOnly>
            <Button asChild className="bg-brand hover:bg-hover-accent text-content-text-primary">
              <Link to="/blog/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Link>
            </Button>
          </AdminOnly>
        </div>

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
    </div>
  );
}

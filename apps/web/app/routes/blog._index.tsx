import type { BlogPost } from "@bip/domain";
import { BlogCard } from "~/components/blog/blog-card";
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

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blog Posts</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((blogPost) => (
            <BlogCard key={blogPost.id} blogPost={blogPost} />
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

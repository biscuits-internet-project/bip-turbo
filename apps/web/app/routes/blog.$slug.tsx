import type { BlogPost } from "@bip/domain";
import Markdown from "react-markdown";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  blogPost: BlogPost;
}

export const loader = publicLoader<LoaderData>(async ({ params }) => {
  const slug = params.slug;
  if (!slug) throw notFound();

  const blogPost = await services.blogPosts.findBySlug(slug);
  if (!blogPost) throw notFound();

  return { blogPost };
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
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{blogPost.title}</h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">{formatDate(blogPost.publishedAt)}</p>
        </div>

        <div className="flex items-center justify-between">
          {blogPost.imageUrls && blogPost.imageUrls.length > 0 && (
            <img src={blogPost.imageUrls[0]} alt={blogPost.title} className="w-full h-40 object-cover" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Markdown>{blogPost.content}</Markdown>
        </div>
      </div>
    </div>
  );
}

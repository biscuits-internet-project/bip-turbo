import type { BlogPost } from "@bip/domain";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  blogPosts: BlogPost[];
}

export const loader = publicLoader<LoaderData>(async () => {
  const blogPosts = await services.blogPosts.findMany();

  return { blogPosts };
});

export default function Blog() {
  const { blogPosts = [] } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Tour Dates</h1>
        </div>

        {blogPosts.map((blogPost) => (
          <Card key={blogPost.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>{blogPost.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

import type { BlogPost, BlogPostState } from "@bip/domain";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { BlogPostForm, type BlogPostFormValues } from "~/components/blog/blog-form";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

interface LoaderData {
  blogPost: BlogPost & {
    files: Array<{
      path: string;
      url: string;
      isCover: boolean;
    }>;
  };
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const blogPost = await services.blogPosts.findBySlug(slug as string);

  if (!blogPost) {
    throw notFound(`Blog post with slug "${slug}" not found`);
  }

  // Get associated files
  const files = await services.files.findByBlogPostId(blogPost.id);

  return {
    blogPost: {
      ...blogPost,
      files: files.map((file) => ({
        path: file.path,
        url: file.url || "",
        isCover: file.isCover || false,
      })),
    },
  };
});

export const action = adminAction(async ({ request, params, context }: ActionFunctionArgs) => {
  const { slug } = params;
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const blurb = formData.get("blurb") as string;
  const content = formData.get("content") as string;
  const state = formData.get("state") as BlogPostState;
  const publishedAt = formData.get("publishedAt") as string;
  const newSlug = formData.get("slug") as string;

  // Extract files from form data
  const files: { path: string; url: string; isCover?: boolean }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("files[") && key.endsWith("][path]")) {
      const index = Number.parseInt(key.match(/\[(\d+)\]/)?.[1] || "0", 10);
      const url = formData.get(`files[${index}][url]`) as string;
      const isCover = formData.get(`files[${index}][isCover]`) === "true";
      files[index] = { path: value as string, url, isCover };
    }
  }

  logger.info("Files to update", { files });

  const blogPost = await services.blogPosts.update(slug as string, {
    title,
    blurb: blurb || null,
    content: content || null,
    state,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    slug: newSlug,
    postType: "blog",
  });

  logger.info("Updated blog post", { blogPost });

  // Create file records for each uploaded file if they don't exist
  if (files.length > 0) {
    logger.info("Creating file records...");
    await Promise.all(
      files.map(async (file) => {
        try {
          // Try to create the file record
          await services.files.create({
            path: file.path,
            filename: file.path.split("/").pop() || "",
            type: "image",
            size: 0, // Size is not critical since files are stored in Supabase
            userId: context.currentUser?.id as string,
            blogPostId: blogPost.id,
            isCover: file.isCover,
          });
        } catch (error) {
          // If file already exists, that's fine - we'll associate it in the next step
          logger.info("File might already exist", { error });
        }
      }),
    );
  }

  // Update file associations
  logger.info("Updating file associations for blog post", { blogPostId: blogPost.id });
  await services.files.updateBlogPostFiles(blogPost.id, files);

  return redirect(`/blog/${blogPost.slug}`);
});

export default function EditBlogPost() {
  const { blogPost } = useSerializedLoaderData<LoaderData>();
  const [defaultValues, setDefaultValues] = useState<BlogPostFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Set form values when blog post data is loaded
  useEffect(() => {
    if (blogPost) {
      setDefaultValues({
        title: blogPost.title,
        blurb: blogPost.blurb || null,
        content: blogPost.content || null,
        state: blogPost.state,
        publishedAt: blogPost.publishedAt ? new Date(blogPost.publishedAt).toISOString().slice(0, 16) : null,
        files: blogPost.files || [],
      });
      setIsLoading(false);
    }
  }, [blogPost]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Edit Blog Post" backLink={{ to: `/blog/${blogPost.slug}`, label: "Back to Post" }} />
      </div>

      <AdminOnly>
        <Card className="card-premium">
          <CardContent className="p-6">
            <BlogPostForm
              defaultValues={defaultValues}
              submitLabel="Save Changes"
              cancelHref={`/blog/${blogPost.slug}`}
            />
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}

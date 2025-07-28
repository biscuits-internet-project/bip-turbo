import type { BlogPostState } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { BlogPostForm } from "~/components/blog/blog-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const blurb = formData.get("blurb") as string;
  const content = formData.get("content") as string;
  const state = formData.get("state") as BlogPostState;
  const publishedAt = formData.get("publishedAt") as string;
  const slug = formData.get("slug") as string;

  // Extract files from form data
  const files: { path: string; url: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("files[") && key.endsWith("][path]")) {
      const index = Number.parseInt(key.match(/\[(\d+)\]/)?.[1] || "0", 10);
      const url = formData.get(`files[${index}][url]`) as string;
      files[index] = { path: value as string, url };
    }
  }

  // Create the blog post
  const blogPost = await services.blogPosts.create({
    title,
    blurb: blurb || null,
    content: content || null,
    state,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    slug,
    postType: "blog",
    userId: context.currentUser?.id as string,
  });

  // Create file records for each uploaded file
  if (files.length > 0) {
    await Promise.all(
      files.map((file) =>
        services.files.create({
          path: file.path,
          filename: file.path.split("/").pop() || "",
          type: "image",
          size: 0, // Size is not critical since files are stored in Supabase
          userId: context.currentUser?.id as string,
          blogPostId: blogPost.id,
        }),
      ),
    );
  }

  return redirect(`/blog/${blogPost.slug}`);
});

export default function NewBlogPost() {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-content-text-primary">Create Blog Post</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/blog" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </Button>
      </div>

      <AdminOnly>
        <Card className="card-premium">
          <CardContent className="p-6">
            <BlogPostForm submitLabel="Create Post" cancelHref="/blog" />
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}

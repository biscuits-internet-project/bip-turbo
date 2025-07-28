import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router-dom";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { FileUpload } from "~/components/ui/file-upload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const BlogPostState = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

type BlogPostState = (typeof BlogPostState)[keyof typeof BlogPostState];

interface UploadedFile {
  path: string;
  url: string;
  isCover?: boolean;
}

// Create a schema for blog post form
export const blogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  blurb: z.string().nullable(),
  content: z.string().nullable(),
  state: z.enum([BlogPostState.DRAFT, BlogPostState.PUBLISHED]),
  publishedAt: z.string().nullable(),
  files: z.array(
    z.object({
      path: z.string(),
      url: z.string(),
      isCover: z.boolean().optional(),
    }),
  ),
});

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  defaultValues?: BlogPostFormValues;
  submitLabel: string;
  cancelHref: string;
}

export function BlogPostForm({ defaultValues, submitLabel, cancelHref }: BlogPostFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: defaultValues || {
      title: "",
      blurb: null,
      content: null,
      state: BlogPostState.DRAFT,
      publishedAt: null,
      files: [],
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    console.log("Blog form submitting with files:", uploadedFiles);
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== null) {
        if (key === "files") {
          // Add each file as a separate entry
          uploadedFiles.forEach((file, index) => {
            console.log("Adding file to form data:", { index, file });
            formData.append(`files[${index}][path]`, file.path);
            formData.append(`files[${index}][url]`, file.url);
            if (file.isCover) {
              formData.append(`files[${index}][isCover]`, "true");
            }
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    }
    submit(formData, { method: "post" });
  };

  const handleFileUpload = (result: UploadedFile) => {
    console.log("File upload completed:", result);
    // Prepend 'uploads/' to the path to match the bucket structure
    setUploadedFiles((prev) => [
      ...prev,
      {
        ...result,
        path: `uploads/${result.path}`,
      },
    ]);
  };

  const toggleCover = (path: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) => ({
        ...file,
        isCover: file.path === path ? !file.isCover : false,
      })),
    );
  };

  // Initialize uploaded files from default values
  useEffect(() => {
    if (defaultValues?.files) {
      console.log("Initializing uploaded files from default values:", defaultValues.files);
      setUploadedFiles(defaultValues.files);
    }
  }, [defaultValues]);

  // Log whenever uploaded files change
  useEffect(() => {
    console.log("Current uploaded files:", uploadedFiles);
  }, [uploadedFiles]);

  return (
    <Form {...form}>
      <div className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }: { field: ControllerRenderProps<BlogPostFormValues, "publishedAt"> }) => (
            <FormItem>
              <FormControl>
                <DatePicker date={field.value ? new Date(field.value) : new Date()} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: ControllerRenderProps<BlogPostFormValues, "title"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} className="bg-content-bg-secondary border-content-bg-secondary text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blurb"
          render={({ field }: { field: ControllerRenderProps<BlogPostFormValues, "blurb"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">Blurb</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter blurb"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-content-bg-secondary border-content-bg-secondary text-white min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }: { field: ControllerRenderProps<BlogPostFormValues, "content"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter content (Markdown supported)"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value || null);
                    // Auto-adjust height
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className="bg-content-bg-secondary border-content-bg-secondary text-white min-h-[300px] font-mono resize-none overflow-hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-content-bg-secondary border-content-bg-secondary text-white">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-content-bg-secondary border-content-bg-secondary">
                  <SelectItem value={BlogPostState.DRAFT} className="text-white">
                    Draft
                  </SelectItem>
                  <SelectItem value={BlogPostState.PUBLISHED} className="text-white">
                    Published
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="text-content-text-primary">Images</FormLabel>
          <div className="space-y-4">
            <FileUpload
              bucket="uploads"
              folder="blog"
              onUploadComplete={handleFileUpload}
              className="bg-content-bg-secondary border-content-bg-secondary"
              accept="image/*"
            />
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {uploadedFiles.map((file) => (
                  <div key={file.path} className="relative group">
                    <img
                      src={file.url}
                      alt="Content for blog post"
                      className={cn(
                        "w-full h-40 object-cover rounded-md transition-all",
                        file.isCover && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      )}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-md flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant={file.isCover ? "secondary" : "default"}
                        size="sm"
                        onClick={() => toggleCover(file.path)}
                      >
                        {file.isCover ? "Remove Cover" : "Set as Cover"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setUploadedFiles((prev) => prev.filter((f) => f.path !== file.path));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    {file.isCover && (
                      <Badge variant="secondary" className="absolute top-2 left-2">
                        Cover Image
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormItem>

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-brand hover:bg-hover-accent text-white"
          >
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelHref)}
            className="border-gray-600 text-content-text-primary hover:bg-content-bg-secondary hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}

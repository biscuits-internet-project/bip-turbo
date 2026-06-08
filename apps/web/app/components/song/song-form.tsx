import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router-dom";
import { z } from "zod";
import { AuthorSearch } from "~/components/author/author-search";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { GlassSelect } from "~/components/ui/glass-select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { formInputClass } from "~/lib/form-styles";
import { cn } from "~/lib/utils";

// Create a schema for song form (omitting auto-generated fields)
export const songFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorId: z.string().uuid().nullable(),
  lyrics: z.string().nullable(),
  tabs: z.string().nullable(),
  notes: z.string().nullable(),
  kind: z.enum(["original", "cover", "mashup", "improvisation"]).nullable(),
  history: z.string().nullable(),
  featuredLyric: z.string().nullable(),
  guitarTabsUrl: z.string().nullable(),
});

export type SongFormValues = z.infer<typeof songFormSchema>;

interface SongFormProps {
  defaultValues?: SongFormValues;
  submitLabel: string;
  cancelHref: string;
}

export function SongForm({ defaultValues, submitLabel, cancelHref }: SongFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const form = useForm<SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: defaultValues || {
      title: "",
      authorId: null,
      lyrics: null,
      tabs: null,
      notes: null,
      kind: "original",
      history: null,
      featuredLyric: null,
      guitarTabsUrl: null,
    },
  });

  const onSubmit = (data: SongFormValues) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== null) {
        formData.append(key, value.toString());
      }
    }
    submit(formData, { method: "post" });
  };

  return (
    <Form {...form}>
      <form className="space-y-6 max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "title"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Song Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter song title" {...field} className={formInputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorId"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "authorId"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Author</FormLabel>
              <FormControl>
                <AuthorSearch
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select or create author..."
                  className="w-full"
                  allowCreate
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lyrics"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "lyrics"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Lyrics</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter lyrics"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={cn(formInputClass, "min-h-[200px]")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tabs"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "tabs"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Tabs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter tabs"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={cn(formInputClass, "min-h-[200px] font-mono")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "notes"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notes"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={formInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="history"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "history"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter song history"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={formInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featuredLyric"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "featuredLyric"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Featured Lyric</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter featured lyric"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={formInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guitarTabsUrl"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "guitarTabsUrl"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Guitar Tabs URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter guitar tabs URL"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className={formInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kind"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "kind"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Type</FormLabel>
              <FormControl>
                <GlassSelect
                  value={field.value || "original"}
                  onValueChange={field.onChange}
                  options={[
                    { value: "original", label: "Original" },
                    { value: "cover", label: "Cover" },
                    { value: "mashup", label: "Mashup" },
                    { value: "improvisation", label: "Improvisation" },
                  ]}
                  className="w-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" variant="brand">
            {submitLabel}
          </Button>
          <Button type="button" variant="cancel" onClick={() => navigate(cancelHref)}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

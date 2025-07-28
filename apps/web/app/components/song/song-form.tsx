import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router-dom";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

// Create a schema for song form (omitting auto-generated fields)
export const songFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  lyrics: z.string().nullable(),
  tabs: z.string().nullable(),
  notes: z.string().nullable(),
  cover: z.boolean().nullable(),
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
      lyrics: null,
      tabs: null,
      notes: null,
      cover: false,
      history: null,
      featuredLyric: null,
      guitarTabsUrl: null,
    },
  });

  const onSubmit = (data: SongFormValues) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== null) {
        if (key === "cover") {
          formData.append(key, value ? "on" : "off");
        } else {
          formData.append(key, value.toString());
        }
      }
    }
    submit(formData, { method: "post" });
  };

  return (
    <Form {...form}>
      <div className="space-y-6 max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "title"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Song Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter song title" {...field} className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary" />
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
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary min-h-[200px]"
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
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary min-h-[200px] font-mono"
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
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
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
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
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
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
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
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "cover"> }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  className="bg-content-bg-secondary border-content-bg-secondary"
                />
              </FormControl>
              <FormLabel className="text-content-text-secondary">Cover Song</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-brand-primary hover:bg-hover-accent text-content-text-primary"
          >
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelHref)}
            className="border-content-bg-secondary text-content-text-secondary hover:bg-content-bg-secondary hover:text-content-text-primary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}

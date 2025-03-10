import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  onSubmit?: (data: SongFormValues) => Promise<void>;
  submitLabel: string;
  cancelHref: string;
}

export function SongForm({ defaultValues, onSubmit, submitLabel, cancelHref }: SongFormProps) {
  const navigate = useNavigate();

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

  const handleSubmit = onSubmit || (() => Promise.resolve());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: ControllerRenderProps<SongFormValues, "title"> }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Song Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter song title" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
              <FormLabel className="text-gray-200">Lyrics</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter lyrics"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
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
              <FormLabel className="text-gray-200">Tabs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter tabs"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white min-h-[200px] font-mono"
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
              <FormLabel className="text-gray-200">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notes"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
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
              <FormLabel className="text-gray-200">History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter song history"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
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
              <FormLabel className="text-gray-200">Featured Lyric</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter featured lyric"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
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
              <FormLabel className="text-gray-200">Guitar Tabs URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter guitar tabs URL"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
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
                  className="bg-gray-800 border-gray-700"
                />
              </FormControl>
              <FormLabel className="text-gray-200">Cover Song</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" className="bg-purple-800 hover:bg-purple-700 text-white">
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelHref)}
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

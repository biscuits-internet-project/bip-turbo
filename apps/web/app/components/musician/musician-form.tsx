import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EntityForm } from "~/components/admin/entity-form";
import { AuthorSearch } from "~/components/author/author-search";
import { InstrumentSearch } from "~/components/musician/instrument-search";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { formInputClass } from "~/lib/form-styles";

export const musicianFormSchema = z.object({
  name: z.string().min(1, "Musician name is required"),
  knownFrom: z.string().optional(),
  defaultInstrumentId: z.string().nullable().optional(),
  // Links this musician to their author row so their page can list songs they wrote.
  authorId: z.string().nullable().optional(),
});

export type MusicianFormValues = z.infer<typeof musicianFormSchema>;

interface MusicianFormProps {
  defaultValues?: MusicianFormValues;
  submitLabel: string;
  cancelHref: string;
}

export function MusicianForm({ defaultValues, submitLabel, cancelHref }: MusicianFormProps) {
  const form = useForm<MusicianFormValues>({
    resolver: zodResolver(musicianFormSchema),
    defaultValues: defaultValues || {
      name: "",
      knownFrom: "",
      defaultInstrumentId: null,
      authorId: null,
    },
  });

  return (
    <EntityForm form={form} submitLabel={submitLabel} cancelHref={cancelHref}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }: { field: ControllerRenderProps<MusicianFormValues, "name"> }) => (
          <FormItem>
            <FormLabel className="text-content-text-secondary">Musician Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter musician name" {...field} className={formInputClass} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="knownFrom"
        render={({ field }: { field: ControllerRenderProps<MusicianFormValues, "knownFrom"> }) => (
          <FormItem>
            <FormLabel className="text-content-text-secondary">Known From</FormLabel>
            <FormControl>
              <Input
                placeholder="Band or project (optional)"
                {...field}
                value={field.value ?? ""}
                className={formInputClass}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="defaultInstrumentId"
        render={({ field }: { field: ControllerRenderProps<MusicianFormValues, "defaultInstrumentId"> }) => (
          <FormItem>
            <FormLabel className="text-content-text-secondary">Default Instrument</FormLabel>
            <FormControl>
              <InstrumentSearch value={field.value} onValueChange={field.onChange} allowCreate />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="authorId"
        render={({ field }: { field: ControllerRenderProps<MusicianFormValues, "authorId"> }) => (
          <FormItem>
            <FormLabel className="text-content-text-secondary">Linked Author</FormLabel>
            <FormControl>
              <AuthorSearch
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Link to an author (for songs written)..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EntityForm>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EntityForm } from "~/components/admin/entity-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { formInputClass } from "~/lib/form-styles";

export interface NameFormValues {
  name: string;
}

interface EntityNameFormProps {
  /** Singular noun for the label/placeholder/validation, e.g. "author". */
  noun: string;
  defaultValues?: NameFormValues;
  submitLabel: string;
  cancelHref: string;
}

/**
 * The create/edit form for the single-name admin vocabularies (authors,
 * instruments). Posts the name as FormData so the route action owns the
 * create/update; richer entities (e.g. musicians) keep their own form.
 */
export function EntityNameForm({ noun, defaultValues, submitLabel, cancelHref }: EntityNameFormProps) {
  const title = noun.charAt(0).toUpperCase() + noun.slice(1);

  const form = useForm<NameFormValues>({
    resolver: zodResolver(z.object({ name: z.string().min(1, `${title} name is required`) })),
    defaultValues: defaultValues || { name: "" },
  });

  return (
    <EntityForm form={form} submitLabel={submitLabel} cancelHref={cancelHref}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }: { field: ControllerRenderProps<NameFormValues, "name"> }) => (
          <FormItem>
            <FormLabel className="text-content-text-secondary">{title} Name</FormLabel>
            <FormControl>
              <Input placeholder={`Enter ${noun} name`} {...field} className={formInputClass} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EntityForm>
  );
}

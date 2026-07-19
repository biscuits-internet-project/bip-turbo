import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownOptionGroup {
  label: string;
  options: DropdownOption[];
}

interface DropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options?: DropdownOption[];
  groups?: DropdownOptionGroup[];
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  size?: "default" | "compact";
  className?: string;
}

// The one dropdown every finite-option select uses. Two things make it read
// unmistakably as a dropdown rather than plain text: an opaque raised fill that
// stands off the near-black page, and a full-strength chevron in its own
// bordered "well" that rotates when the menu opens.
//
// The fill references `--content-bg-secondary` directly via an arbitrary value
// on purpose: the `bg-content-bg-*` and shadcn `bg-popover`/`bg-background`
// utilities are never registered in this Tailwind build (only `@theme` tokens
// become utilities), so those classes render transparent. The arbitrary value
// always compiles, so the surface is guaranteed to paint.
const dropdownSurface = "bg-[hsl(var(--content-bg-secondary))]";
const triggerBaseClass = cn(
  "group inline-flex items-center justify-between gap-1 rounded-md border border-[hsl(var(--border))] text-content-text-primary transition-colors",
  dropdownSurface,
  "hover:bg-[hsl(var(--content-bg-tertiary))] focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 data-[placeholder]:text-content-text-tertiary",
);
const triggerSizeClass = {
  default: "h-11 px-3 text-sm",
  compact: "h-[34px] px-2 text-sm",
} as const;

export function Dropdown({
  value,
  onValueChange,
  options,
  groups,
  placeholder,
  ariaLabel,
  id,
  size = "default",
  className,
}: DropdownProps) {
  // Every label the trigger might display. Rendered invisibly, stacked in one
  // grid cell, they reserve the width of the longest option so the trigger
  // stays a fixed size instead of resizing each time the selection changes.
  const measureLabels = [
    ...(placeholder ? [placeholder] : []),
    ...(options ?? []).map((option) => option.label),
    ...(groups ?? []).flatMap((group) => group.options.map((option) => option.label)),
  ];
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(triggerBaseClass, triggerSizeClass[size], className)}
      >
        <span className="grid min-w-0 overflow-hidden text-left">
          {measureLabels.map((label, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: purely presentational width-measuring ghosts
            <span key={index} aria-hidden className="invisible whitespace-nowrap [grid-area:1/1]">
              {label}
            </span>
          ))}
          <span className="truncate [grid-area:1/1]">
            <SelectValue placeholder={placeholder} />
          </span>
        </span>
        <span className="-mr-1 flex items-center self-stretch border-l border-[hsl(var(--border))] pl-2 text-content-text-secondary">
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </span>
      </SelectPrimitive.Trigger>
      <SelectContent className={cn(dropdownSurface, "border-[hsl(var(--border))]")}>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-content-text-primary">
            {option.label}
          </SelectItem>
        ))}
        {groups?.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className="py-1 text-xs uppercase tracking-wide text-content-text-tertiary">
              {group.label}
            </SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-content-text-primary">
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

export const glassSelectTriggerClass =
  "h-[34px] text-sm bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20";
export const glassSelectContentClass = "bg-glass-bg border-glass-border backdrop-blur-md";
export const glassSelectItemClass = "text-content-text-primary hover:bg-hover-glass";

export interface GlassSelectOption {
  value: string;
  label: string;
}

interface GlassSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: GlassSelectOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Standard select dropdown with the project's "glass" styling — same trigger
 * and popover treatment as the filter dropdowns on /songs (Time Range, Cover,
 * Author). Use this anywhere a finite-option select is needed so dropdowns
 * stay visually consistent across pages.
 */
export function GlassSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  className,
  ariaLabel,
}: GlassSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={cn(glassSelectTriggerClass, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={glassSelectContentClass}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className={glassSelectItemClass}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

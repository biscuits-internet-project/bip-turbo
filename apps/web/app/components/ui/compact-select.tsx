import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

export const compactSelectTriggerClass =
  "h-[34px] text-sm border text-white focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20";
export const compactSelectContentClass = "backdrop-blur-md";
export const compactSelectItemClass = "text-content-text-primary";

export interface CompactSelectOption {
  value: string;
  label: string;
}

interface CompactSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: CompactSelectOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Standard compact select dropdown, with the same trigger and popover treatment
 * as the filter dropdowns on /songs (Time Range, Cover, Author). Use this
 * anywhere a finite-option select is needed so dropdowns stay visually
 * consistent across pages.
 */
export function CompactSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  className,
  ariaLabel,
}: CompactSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={cn(compactSelectTriggerClass, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={compactSelectContentClass}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className={compactSelectItemClass}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

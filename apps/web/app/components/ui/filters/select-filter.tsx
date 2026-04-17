import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const selectTriggerClass =
  "h-[34px] text-sm bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20";
const selectContentClass = "bg-glass-bg border-glass-border backdrop-blur-md";
const selectItemClass = "text-content-text-primary hover:bg-hover-glass";
const labelClass =
  "text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center";
const groupLabelClass = "text-xs uppercase text-content-text-tertiary tracking-wide py-1";

export interface SelectFilterOptionGroup {
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface SelectFilterProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  groups?: SelectFilterOptionGroup[];
  placeholder?: string;
  width?: string;
}

export function SelectFilter({
  id,
  label,
  value,
  onValueChange,
  options,
  groups,
  placeholder,
  width,
}: SelectFilterProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className={`${width ?? ""} ${selectTriggerClass}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value} className={selectItemClass}>
              {option.label}
            </SelectItem>
          ))}
          {groups?.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel className={groupLabelClass}>{group.label}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value} className={selectItemClass}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

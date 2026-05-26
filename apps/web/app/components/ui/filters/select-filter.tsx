import { glassSelectContentClass, glassSelectItemClass, glassSelectTriggerClass } from "~/components/ui/glass-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
        <SelectTrigger id={id} className={`${width ?? ""} ${glassSelectTriggerClass}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={glassSelectContentClass}>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value} className={glassSelectItemClass}>
              {option.label}
            </SelectItem>
          ))}
          {groups?.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel className={groupLabelClass}>{group.label}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value} className={glassSelectItemClass}>
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

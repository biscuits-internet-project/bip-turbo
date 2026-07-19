import { Dropdown } from "~/components/ui/dropdown";

const labelClass =
  "text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center";

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
      <Dropdown
        id={id}
        size="compact"
        value={value}
        onValueChange={onValueChange}
        options={options}
        groups={groups}
        placeholder={placeholder}
        ariaLabel={label}
        className={width}
      />
    </div>
  );
}

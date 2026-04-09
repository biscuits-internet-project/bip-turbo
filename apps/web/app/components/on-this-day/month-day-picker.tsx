import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface MonthDayPickerProps {
  monthDay: string;
  displayLabel: string;
}

export function MonthDayPicker({ monthDay, displayLabel }: MonthDayPickerProps) {
  const navigate = useNavigate();
  const [mm, dd] = monthDay.split("-").map(Number);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 text-content-text-secondary text-3xl font-medium hover:text-content-text-primary transition-colors cursor-pointer"
        >
          {displayLabel}
          <CalendarDays className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[hsl(224,71%,4%)] border-[hsl(240,5%,20%)]" sideOffset={8}>
        <Calendar
          mode="single"
          defaultMonth={new Date(2000, mm - 1)}
          selected={new Date(2000, mm - 1, dd)}
          onSelect={(date: Date | undefined) => {
            if (!date) return;
            const selectedMonth = String(date.getMonth() + 1).padStart(2, "0");
            const selectedDay = String(date.getDate()).padStart(2, "0");
            navigate(`/on-this-day/${selectedMonth}-${selectedDay}`);
          }}
          formatters={{
            formatCaption: (month: Date) => month.toLocaleString("default", { month: "long" }),
          }}
          hideWeekdays
          classNames={{
            month_caption: "flex justify-center items-center relative mb-2",
            caption_label: "text-sm font-medium",
            nav: "absolute inset-x-0 flex justify-between px-1",
            button_previous:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center",
            button_next:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center",
            day_button:
              "cursor-pointer h-9 w-9 p-0 font-normal inline-flex items-center justify-center rounded-md hover:bg-white/10",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

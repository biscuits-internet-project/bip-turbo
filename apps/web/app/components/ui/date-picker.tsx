"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker({ date }: { date: Date }) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Set publish date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

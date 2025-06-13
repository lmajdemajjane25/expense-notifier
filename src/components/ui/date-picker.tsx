
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "yyyy-MM-dd") : ""
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"));
    } else {
      setInputValue("");
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the date
    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      onDateChange(parsedDate);
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex">
        <Input
          type="date"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          className="rounded-r-none border-r-0"
          placeholder="YYYY-MM-DD"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-l-none border-l-0 px-3"
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

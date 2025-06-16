
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
    date ? format(date, "dd/MM/yy") : ""
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the date in DD/MM/YY format
    const dateParts = value.split('/');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(dateParts[2], 10);
      const fullYear = year < 50 ? 2000 + year : 1900 + year; // Assume years 00-49 are 2000s, 50-99 are 1900s
      
      const parsedDate = new Date(fullYear, month, day);
      if (!isNaN(parsedDate.getTime()) && 
          parsedDate.getDate() === day && 
          parsedDate.getMonth() === month && 
          parsedDate.getFullYear() === fullYear) {
        onDateChange(parsedDate);
      }
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
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          className="rounded-r-none border-r-0"
          placeholder="DD/MM/YY"
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

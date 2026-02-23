"use client";

import * as React from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePopoverContainer } from "./popover-container-context";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder = "Scegli data",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ?? undefined;
  const popoverContainer = usePopoverContainer();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-left ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--calendar-brown)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={!date ? "text-zinc-500" : ""}>
            {date ? format(date, "dd MMM yyyy", { locale: it }) : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-zinc-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent container={popoverContainer} className="z-[100] w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onChange(d ?? null);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

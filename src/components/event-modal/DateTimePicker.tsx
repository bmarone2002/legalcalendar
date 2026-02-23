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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  className,
  placeholder = "Scegli data e ora",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value;
  const popoverContainer = usePopoverContainer();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const setDateOnly = (d: Date | undefined) => {
    if (!d) return;
    const next = new Date(date);
    next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
    onChange(next);
  };

  const setHour = (h: number) => {
    const next = new Date(date);
    next.setHours(h, next.getMinutes(), 0, 0);
    onChange(next);
  };

  const setMinute = (m: number) => {
    const next = new Date(date);
    next.setMinutes(m, 0, 0);
    onChange(next);
  };

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
            {date
              ? format(date, "dd MMM yyyy · HH:mm", { locale: it })
              : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-zinc-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent container={popoverContainer} className="z-[100] w-auto p-0" align="start">
        <div className="flex flex-col gap-3 p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setDateOnly(d)}
            initialFocus
          />
          <div className="flex gap-2 border-t border-zinc-200 pt-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-600">Ora</label>
              <Select
                value={String(hour)}
                onValueChange={(v) => setHour(Number(v))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-600">Minuti</label>
              <Select
                value={String(minute)}
                onValueChange={(v) => setMinute(Number(v))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      :{String(m).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

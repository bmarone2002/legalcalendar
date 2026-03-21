"use client";

import * as React from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "./DatePicker";
import { cn } from "@/lib/utils";

function isDateOnly(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim());
}

function toDateOnlyString(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function combineDateAndTime(date: Date, timeHHMM: string): string {
  const [h, m] = timeHHMM.split(":").map(Number);
  const y = date.getFullYear();
  const mo = date.getMonth();
  const day = date.getDate();
  const d = new Date(y, mo, day, h ?? 0, m ?? 0, 0, 0);
  return d.toISOString();
}

function parseValue(
  value: string,
  fallbackTime: string,
): {
  dateForPicker: Date | null;
  useCustomTime: boolean;
  timeHHMM: string;
} {
  if (!value.trim()) {
    return { dateForPicker: null, useCustomTime: false, timeHHMM: fallbackTime };
  }
  if (isDateOnly(value)) {
    const d = new Date(value + "T12:00:00");
    return {
      dateForPicker: isNaN(d.getTime()) ? null : d,
      useCustomTime: false,
      timeHHMM: fallbackTime,
    };
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return { dateForPicker: null, useCustomTime: false, timeHHMM: fallbackTime };
  }
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return { dateForPicker: d, useCustomTime: true, timeHHMM: `${hh}:${mi}` };
}

export interface DatePickerWithOptionalTimeProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /** Orario mostrato nel controllo quando attivi l’ora manuale (default 08:00, come in impostazioni). */
  defaultTimeForNewOverride?: string;
}

/**
 * Data con orario implicito dalle regole predefinite (solo giorno).
 * Opzionalmente: checkbox + input time per salvare un ISO datetime con ora esplicita.
 */
export function DatePickerWithOptionalTime({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  defaultTimeForNewOverride = "08:00",
}: DatePickerWithOptionalTimeProps) {
  const optTimeId = React.useId();
  const fallback = defaultTimeForNewOverride;
  const { dateForPicker, useCustomTime, timeHHMM } = parseValue(value, fallback);

  const handleDateChange = (d: Date | null) => {
    if (!d) {
      onChange("");
      return;
    }
    if (useCustomTime) {
      onChange(combineDateAndTime(d, timeHHMM));
    } else {
      onChange(toDateOnlyString(d));
    }
  };

  const handleToggleCustomTime = (checked: boolean) => {
    if (!dateForPicker) return;
    if (checked) {
      onChange(combineDateAndTime(dateForPicker, fallback));
    } else {
      onChange(toDateOnlyString(dateForPicker));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    if (!dateForPicker || !t) return;
    onChange(combineDateAndTime(dateForPicker, t));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <DatePicker
        value={dateForPicker}
        onChange={handleDateChange}
        placeholder={placeholder}
        className={disabled ? "opacity-60 pointer-events-none" : undefined}
      />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id={optTimeId}
            checked={useCustomTime}
            onCheckedChange={(c) => handleToggleCustomTime(c === true)}
            disabled={disabled || !dateForPicker}
          />
          <Label
            htmlFor={optTimeId}
            className="text-xs font-normal text-zinc-600 cursor-pointer"
          >
            Imposta ora specifica
          </Label>
        </div>
        {useCustomTime && (
          <input
            type="time"
            value={timeHHMM}
            onChange={handleTimeChange}
            disabled={disabled}
            className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:ring-offset-2"
          />
        )}
      </div>
      <p className="text-[11px] text-zinc-400 leading-snug">
        Senza ora specifica valgono le regole predefinite dell’app per gli orari delle scadenze (come da
        impostazioni).
      </p>
    </div>
  );
}

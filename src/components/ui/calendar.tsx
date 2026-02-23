"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { it } from "react-day-picker/locale";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={it}
      className={cn("p-3 rdp", className)}
      classNames={{
        day_button:
          "rdp-day_button h-9 w-9 p-0 font-normal rounded-md cursor-pointer pointer-events-auto hover:bg-zinc-100 aria-selected:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--calendar-brown)] focus-visible:ring-offset-2",
        selected:
          "!bg-[var(--calendar-brown)] !text-white hover:!bg-[var(--calendar-brown)] hover:!text-white",
        today: "!bg-zinc-100 !text-zinc-900",
        outside: "!text-zinc-400 !opacity-50",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

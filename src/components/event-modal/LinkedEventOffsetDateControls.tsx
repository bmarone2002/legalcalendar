"use client";

import { DatePicker } from "./DatePicker";
import {
  bestOffsetDaysForLinkedTargetDate,
  computeLinkedEventDueAt,
} from "@/lib/linked-events";
import { DEFAULT_APP_SETTINGS } from "@/lib/default-app-settings";

const OFFSET_MIN = -365;
const OFFSET_MAX = 365;

function atNoonLocal(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

export function LinkedEventOffsetDateControls({
  offsetDays,
  useFerialeSuspension = false,
  onOffsetChange,
  referenceDate,
  readOnly = false,
  decrementAriaLabel = "Diminuisci giorni",
  incrementAriaLabel = "Aumenta giorni",
  minusButtonClassName,
  plusButtonClassName,
  counterClassName,
}: {
  offsetDays: number;
  useFerialeSuspension?: boolean;
  onOffsetChange: (next: number) => void;
  referenceDate: Date | null;
  readOnly?: boolean;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
  minusButtonClassName?: string;
  plusButtonClassName?: string;
  counterClassName?: string;
}) {
  const settings = DEFAULT_APP_SETTINGS;
  const refOk =
    referenceDate != null &&
    !isNaN(referenceDate.getTime());
  const refNoon = refOk ? atNoonLocal(referenceDate) : null;
  const resultDate =
    refNoon != null
      ? computeLinkedEventDueAt(
          refNoon,
          offsetDays,
          useFerialeSuspension,
          settings,
        )
      : null;

  const baseBtn =
    "flex h-9 w-9 items-center justify-center text-lg font-semibold leading-none text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40";
  const defaultMinus = `${baseBtn} border-r border-zinc-200`;
  const defaultPlus = `${baseBtn} border-l border-zinc-200`;

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:inline-flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <div className="inline-flex w-max max-w-full items-stretch overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() =>
            onOffsetChange(Math.max(OFFSET_MIN, offsetDays - 1))
          }
          className={minusButtonClassName ?? defaultMinus}
          aria-label={decrementAriaLabel}
          disabled={readOnly}
        >
          −
        </button>
        <span
          className={
            counterClassName ??
            "flex min-w-[3rem] items-center justify-center bg-zinc-50/80 px-2 text-sm font-semibold tabular-nums text-zinc-900"
          }
        >
          {offsetDays >= 0 ? "+" : ""}
          {offsetDays}
        </span>
        <button
          type="button"
          onClick={() =>
            onOffsetChange(Math.min(OFFSET_MAX, offsetDays + 1))
          }
          className={plusButtonClassName ?? defaultPlus}
          aria-label={incrementAriaLabel}
          disabled={readOnly}
        >
          +
        </button>
      </div>
      <DatePicker
        value={resultDate}
        onChange={(d) => {
          if (!refNoon || !d || readOnly) return;
          const next = bestOffsetDaysForLinkedTargetDate(
            refNoon,
            d,
            useFerialeSuspension,
            settings,
            OFFSET_MIN,
            OFFSET_MAX,
          );
          onOffsetChange(next);
        }}
        disabled={!refOk || readOnly}
        placeholder={refOk ? "Data risultante" : "Data base…"}
        className="h-9 w-full min-w-0 border-zinc-200 bg-white px-2 py-0 text-xs sm:w-[10rem] sm:shrink-0 sm:text-sm"
      />
    </div>
  );
}

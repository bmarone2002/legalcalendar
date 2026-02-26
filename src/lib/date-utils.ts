import {
  addDays,
  setHours,
  setMinutes,
  startOfDay,
  getDay,
  getMonth,
  getDate,
  isSameDay,
  getYear,
} from "date-fns";
import type { AppSettings } from "./rules/types";
import type { SubEventCandidate } from "./rules/types";

// ── Italian fixed holidays (MM-DD) ──────────────────────────────────

const ITALIAN_FIXED_HOLIDAYS = [
  "01-01", // Capodanno
  "01-06", // Epifania
  "04-25", // Liberazione
  "05-01", // Festa dei lavoratori
  "06-02", // Festa della Repubblica
  "08-15", // Ferragosto
  "11-01", // Ognissanti
  "12-08", // Immacolata
  "12-25", // Natale
  "12-26", // Santo Stefano
];

/**
 * Compute Easter Sunday for a given year (Anonymous Gregorian algorithm).
 */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// ── Predicates ──────────────────────────────────────────────────────

export function isWeekend(date: Date): boolean {
  const dow = getDay(date);
  return dow === 0 || dow === 6;
}

export function isItalianHoliday(date: Date, extraHolidays?: string[]): boolean {
  const mmdd =
    String(getMonth(date) + 1).padStart(2, "0") +
    "-" +
    String(getDate(date)).padStart(2, "0");

  if (ITALIAN_FIXED_HOLIDAYS.includes(mmdd)) return true;
  if (extraHolidays?.includes(mmdd)) return true;

  const year = getYear(date);
  const easter = easterSunday(year);
  const easterMonday = addDays(easter, 1);
  if (isSameDay(date, easter) || isSameDay(date, easterMonday)) return true;

  return false;
}

export function isInFerialeSuspension(
  date: Date,
  startMmDd = "08-01",
  endMmDd = "08-31"
): boolean {
  const mmdd =
    String(getMonth(date) + 1).padStart(2, "0") +
    "-" +
    String(getDate(date)).padStart(2, "0");
  return mmdd >= startMmDd && mmdd <= endMmDd;
}

export function isNonBusinessDay(date: Date, settings: AppSettings): boolean {
  if (isWeekend(date)) return true;
  if (isItalianHoliday(date, settings.italianHolidays)) return true;
  return false;
}

/**
 * Se la data cade di sabato, domenica o festivo, slitta al primo giorno
 * lavorativo successivo (art. 155 c.p.c.).
 */
export function adjustToNextBusinessDay(
  date: Date,
  settings: AppSettings
): Date {
  let d = new Date(date);
  while (isNonBusinessDay(d, settings)) {
    d = addDays(d, 1);
  }
  return d;
}

/**
 * Applica orario standard scadenza alla data.
 */
export function applyDeadlineTime(d: Date, settings: AppSettings): Date {
  const timeStr = settings.defaultTimeForDeadlines ?? "12:00";
  const [h, m] = timeStr.split(":").map(Number);
  return setMinutes(setHours(startOfDay(d), h ?? 12), m ?? 0);
}

/**
 * Assegna slot orari ai sotto-eventi raggruppati per giorno:
 * parte da 12:00 e incrementa di 1h per ogni evento nello stesso giorno.
 * Se supera le 23:00, riparte da 00:00.
 */
export function assignTimeSlots(
  candidates: SubEventCandidate[],
  settings: AppSettings
): SubEventCandidate[] {
  const baseHour = 12;
  const dayMap = new Map<string, number>();

  return candidates.map((c) => {
    const dayKey = startOfDay(c.dueAt).toISOString();
    const count = dayMap.get(dayKey) ?? 0;
    dayMap.set(dayKey, count + 1);

    const hour = (baseHour + count) % 24;
    const adjusted = setMinutes(setHours(startOfDay(c.dueAt), hour), 0);
    return { ...c, dueAt: adjusted };
  });
}

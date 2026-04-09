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

export type TermDirection = "forward" | "backward";

export function isSunday(date: Date): boolean {
  return getDay(date) === 0;
}

export function isSaturday(date: Date): boolean {
  return getDay(date) === 6;
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

/**
 * Festività nazionali (fisse + Pasqua/Lunedì dell'Angelo) + eventuali extra da settings.
 * Nota: "festivo" qui è solo quello giuridico (nazionale), non include sabato/domenica.
 */
export function isHoliday(date: Date, settings: AppSettings): boolean {
  return isItalianHoliday(date, settings.italianHolidays);
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

/**
 * Sposta la data di `numberOfDays` passi lungo la direzione indicata: ogni passo è un giorno
 * di calendario, ma i giorni nel periodo di sospensione feriale (settings) non consumano il contatore.
 * Allineato al modello "i termini non corrono in feriale" per il conteggio degli N giorni.
 */
export function shiftCalendarDaysExcludingFeriale(
  base: Date,
  numberOfDays: number,
  direction: TermDirection,
  settings: AppSettings
): Date {
  if (numberOfDays === 0) return new Date(base);
  const step = direction === "forward" ? 1 : -1;
  let d = new Date(base);
  let remaining = Math.abs(numberOfDays);
  const start = settings.ferialeSuspensionStart ?? "08-01";
  const end = settings.ferialeSuspensionEnd ?? "08-31";

  while (remaining > 0) {
    d = addDays(d, step);
    if (!isInFerialeSuspension(d, start, end)) {
      remaining--;
    }
  }
  return d;
}

export function isNonBusinessDay(date: Date, settings: AppSettings): boolean {
  return isHoliday(date, settings) || isWeekend(date);
}

/**
 * Regola art. 155 c.p.c. (solo controllo sulla scadenza FINALE):
 * - direction="forward": se la scadenza finale cade su sabato/domenica o festività,
 *   si proroga al primo giorno successivo non festivo.
 * - direction="backward": se la scadenza finale cade su sabato/domenica o festività,
 *   si anticipa al primo giorno precedente non festivo.
 */
export function isNonWorkingFinalDay(
  date: Date,
  _direction: TermDirection,
  settings: AppSettings
): boolean {
  const sunday = isSunday(date);
  const saturday = isSaturday(date);
  const holiday = isHoliday(date, settings);
  return sunday || saturday || holiday;
}

export function adjustFinalDeadline(
  date: Date,
  direction: TermDirection,
  settings: AppSettings
): Date {
  let d = new Date(date);
  const step = direction === "forward" ? 1 : -1;
  while (isNonWorkingFinalDay(d, direction, settings)) {
    d = addDays(d, step);
  }
  return d;
}

/**
 * Calcolo scadenza "a giorni" / "a ritroso" includendo i sabati/festivi nel conteggio
 * e applicando la regola art. 155 solo alla scadenza finale.
 */
export function calculateDeadline(
  startDate: Date,
  numberOfDays: number,
  direction: TermDirection,
  settings: AppSettings
): Date {
  const raw = addDays(startDate, numberOfDays);
  return adjustFinalDeadline(raw, direction, settings);
}

// Wrapper storico: mantiene il comportamento forward (proroga).
export function adjustToNextBusinessDay(date: Date, settings: AppSettings): Date {
  return adjustFinalDeadline(date, "forward", settings);
}

const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 22;
const SLOT_RANGE = SLOT_END_HOUR - SLOT_START_HOUR; // 14 slots (08–21)

/**
 * Applica orario standard scadenza alla data (default 08:00).
 */
export function applyDeadlineTime(d: Date, settings: AppSettings): Date {
  const timeStr = settings.defaultTimeForDeadlines ?? "08:00";
  const [h, m] = timeStr.split(":").map(Number);
  return setMinutes(setHours(startOfDay(d), h ?? 8), m ?? 0);
}

/**
 * Assegna slot orari ai sotto-eventi raggruppati per giorno:
 * il primo evento parte da 08:00, ognuno successivo +1h.
 * Range 08:00–22:00; superato il limite si ricomincia da 08:00
 * (sovrapposizione oraria consentita, mai cambio giorno).
 */
export function assignTimeSlots(
  candidates: SubEventCandidate[],
  _settings: AppSettings
): SubEventCandidate[] {
  const dayMap = new Map<string, number>();

  return candidates.map((c) => {
    if (!c.dueAt) return c;
    const dayKey = startOfDay(c.dueAt).toISOString();
    const count = dayMap.get(dayKey) ?? 0;
    dayMap.set(dayKey, count + 1);

    const hour = SLOT_START_HOUR + (count % SLOT_RANGE);
    const adjusted = setMinutes(setHours(startOfDay(c.dueAt), hour), 0);
    return { ...c, dueAt: adjusted };
  });
}

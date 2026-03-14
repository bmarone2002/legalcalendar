import type { AppSettings } from "./rules/types";
import { prisma } from "./db";

const DEFAULT_SETTINGS: AppSettings = {
  defaultReminderTime: "09:00",
  defaultReminderOffsets: [7],
  weekendHandling: undefined,
  holidays: undefined,
  defaultTimeForDeadlines: "08:00",
  defaultReminderOffsetsAtto: [7],
  notificaEsteroDefault: false,
  termineComparizioneCitazioneItalia: 120,
  termineComparizioneCitazioneEstero: 150,
  ferialeSuspensionStart: "08-01",
  ferialeSuspensionEnd: "08-31",
  italianHolidays: [],
};

const SETTINGS_KEY = "app_settings";
const CACHE_TTL_MS = 60_000;
let cachedSettings: AppSettings | null = null;
let cacheTimestamp = 0;

export async function getSettings(): Promise<AppSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSettings;
  }
  try {
    const row = await prisma.setting.findUnique({ where: { id: SETTINGS_KEY } });
    if (row?.value) {
      const parsed = JSON.parse(row.value) as Partial<AppSettings>;
      cachedSettings = { ...DEFAULT_SETTINGS, ...parsed };
    } else {
      cachedSettings = DEFAULT_SETTINGS;
    }
  } catch {
    cachedSettings = DEFAULT_SETTINGS;
  }
  cacheTimestamp = now;
  return cachedSettings;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const merged = { ...current, ...settings };
  await prisma.setting.upsert({
    where: { id: SETTINGS_KEY },
    create: { id: SETTINGS_KEY, value: JSON.stringify(merged) },
    update: { value: JSON.stringify(merged) },
  });
  cachedSettings = merged;
  cacheTimestamp = Date.now();
}

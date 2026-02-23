import type { AppSettings } from "./rules/types";
import { prisma } from "./db";

const DEFAULT_SETTINGS: AppSettings = {
  defaultReminderTime: "09:00",
  defaultReminderOffsets: [7, 1],
  weekendHandling: undefined,
  holidays: undefined,
  defaultTimeForDeadlines: "18:00",
  defaultReminderOffsetsAtto: [-30, -7, -1],
  notificaEsteroDefault: false,
  termineComparizioneCitazioneItalia: 120,
  termineComparizioneCitazioneEstero: 150,
};

const SETTINGS_KEY = "app_settings";

export async function getSettings(): Promise<AppSettings> {
  try {
    const row = await prisma.setting.findUnique({ where: { id: SETTINGS_KEY } });
    if (row?.value) {
      const parsed = JSON.parse(row.value) as Partial<AppSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const merged = { ...current, ...settings };
  await prisma.setting.upsert({
    where: { id: SETTINGS_KEY },
    create: { id: SETTINGS_KEY, value: JSON.stringify(merged) },
    update: { value: JSON.stringify(merged) },
  });
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJsonField(value: string | null): Record<string, unknown> | null {
  if (value == null) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function formatDateTime(d: Date): string {
  return d.toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

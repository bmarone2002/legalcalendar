import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(d: Date): string {
  return d.toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("it-IT");
}

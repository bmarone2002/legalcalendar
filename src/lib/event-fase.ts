import type { Event } from "@/types";
import { getEventoByCode } from "@/types/macro-areas";
import type { ProcedimentoCode } from "@/types/macro-areas";

const MANUALE_CODE = "__MANUALE__";

/**
 * Testo della «Fase» (eventoCode + label tabella o testo manuale).
 */
export function getFaseDisplayFromFields(
  eventoCode: string | null | undefined,
  procedimento: string | null | undefined
): string {
  const code = eventoCode ?? null;
  if (!code || code === MANUALE_CODE) return "";
  const proc = procedimento as ProcedimentoCode | null | undefined;
  if (proc && /^[A-Z][A-Z0-9_]*$/.test(code)) {
    const ev = getEventoByCode(proc, code);
    if (ev?.label) return ev.label;
  }
  return code;
}

export function getFaseDisplayString(e: Event): string {
  return getFaseDisplayFromFields(e.eventoCode, e.procedimento);
}

"use client";

import * as React from "react";

/** Contesto per far rendere il portale del Popover (es. calendario) dentro il Dialog invece che nel body, così i click funzionano con Dialog modale. */
export const PopoverContainerContext = React.createContext<HTMLElement | null>(null);

export function usePopoverContainer(): HTMLElement | null {
  return React.useContext(PopoverContainerContext);
}

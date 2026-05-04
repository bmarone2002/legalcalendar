"use client";

import { useEffect } from "react";

function isScrollableY(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const canOverflow = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canOverflow && element.scrollHeight > element.clientHeight + 1;
}

function canScrollInDirection(element: HTMLElement, deltaY: number): boolean {
  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }
  if (deltaY < 0) {
    return element.scrollTop > 0;
  }
  return false;
}

function findScrollableAncestor(start: EventTarget | null, deltaY: number): HTMLElement | null {
  let node = start instanceof HTMLElement ? start : null;
  while (node) {
    if (isScrollableY(node) && canScrollInDirection(node, deltaY)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

export function WheelScrollSupport() {
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.deltaY === 0 || event.shiftKey) return;

      const scrollable = findScrollableAncestor(event.target, event.deltaY);
      if (!scrollable) return;

      scrollable.scrollTop += event.deltaY;
      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, []);

  return null;
}

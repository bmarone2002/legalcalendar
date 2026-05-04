"use client";

import { useEffect } from "react";

function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Safari desktop/iOS (excluding Chromium- and Firefox-based browsers on Apple devices).
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/i.test(ua);
}

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
    // Safari has different wheel/gesture semantics; forcing custom wheel handling here
    // can cause inconsistent interactions in complex layouts (calendar, modal, nested scrollers).
    if (isSafariBrowser()) return;

    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        !event.cancelable ||
        event.ctrlKey ||
        event.deltaY === 0 ||
        event.shiftKey
      ) {
        return;
      }

      const scrollable = findScrollableAncestor(event.target, event.deltaY);
      if (!scrollable) return;

      const before = scrollable.scrollTop;
      scrollable.scrollTop += event.deltaY;
      const didScroll = scrollable.scrollTop !== before;
      if (!didScroll) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export function useBodyScrollLock(active: boolean, className: string): void {
  useEffect(() => {
    if (!active) return undefined;

    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [active, className]);
}

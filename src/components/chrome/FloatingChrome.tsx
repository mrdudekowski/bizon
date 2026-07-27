"use client";

import type { MouseEventHandler, ReactNode, Ref } from "react";

import BurgerToggle from "@/components/BurgerToggle/BurgerToggle";

import styles from "./FloatingChrome.module.css";
import { useAdaptiveChrome, type ChromeTone } from "./useAdaptiveChrome";

type FloatingChromeProps = {
  ariaLabel: string;
  menuOpen: boolean;
  onMenuToggle(open: boolean): void;
  brand: ReactNode;
  navigation: ReactNode;
  utility?: ReactNode;
  action?: ReactNode;
  toneAttribute: string;
  fallbackTone: ChromeTone;
  surface: "main" | "shop";
  rootRef?: Ref<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
};

export function FloatingChrome({
  ariaLabel,
  menuOpen,
  onMenuToggle,
  brand,
  navigation,
  utility,
  action,
  toneAttribute,
  fallbackTone,
  surface,
  rootRef,
  onMouseLeave,
}: FloatingChromeProps) {
  const { compact, tone } = useAdaptiveChrome(toneAttribute, fallbackTone);

  return (
    <div
      ref={rootRef}
      className={styles.chrome}
      data-tone={tone}
      data-compact={compact ? "true" : "false"}
      data-main-chrome={surface === "main" ? "" : undefined}
      data-shop-chrome={surface === "shop" ? "" : undefined}
      onMouseLeave={onMouseLeave}
    >
      <nav className={styles.bar} aria-label={ariaLabel}>
        <div className={styles.burgerButton}>
          <BurgerToggle
            isOpen={menuOpen}
            onToggle={onMenuToggle}
            inverted={tone === "dark"}
          />
        </div>
        <div className={styles.brand}>{brand}</div>
        <div className={styles.navigation}>{navigation}</div>
        <div className={styles.utility}>{utility}</div>
        <div className={styles.action}>{action}</div>
      </nav>
    </div>
  );
}

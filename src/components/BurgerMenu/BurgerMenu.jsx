"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BurgerMenu.module.css";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const BurgerMenu = ({
  isOpen,
  onClose,
  menuItems = [],
  context = "main",
  title = "Меню сайта",
  homeHref = "/",
  homeLabel = "BIZON",
  featuredItem = null,
  cartItem = null,
}) => {
  const menuRef = useFocusTrap(isOpen);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const isCurrentLink = (href) => {
    const hrefPath = href.split("#")[0];
    return hrefPath === "/" ? pathname === hrefPath : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
  };

  return (
    <div
      id="burger-menu"
      className={`${styles.menuOverlay} ${isOpen ? styles.menuOpen : ""}`}
      aria-hidden={!isOpen}
      inert={isOpen ? undefined : true}
      data-menu-context={context}
    >
      <div
        className={styles.menuBackdrop}
        onClick={onClose}
        role="presentation"
      />

      <aside
        ref={menuRef}
        className={styles.menuPanel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.menuHeader}>
          <Link className={styles.menuBrand} href={homeHref} onClick={onClose} translate="no">
            {homeLabel}
          </Link>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Закрыть меню"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.menuBody}>
          {featuredItem ? (
            <Link className={styles.featuredLink} href={featuredItem.link} onClick={onClose}>
              <span>{featuredItem.name}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}

          {cartItem ? (
            <Link className={styles.cartLink} href={cartItem.link} onClick={onClose}>
              <span>
                {cartItem.name}
                <small>Единая заявка BIZON</small>
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}

          <nav className={styles.menuColumns} aria-label={title}>
            {menuItems.map((column) => (
              <section className={styles.menuColumn} key={column.id} aria-labelledby={`menu-column-${column.id}`}>
                <h2 id={`menu-column-${column.id}`} className={styles.columnTitle}>
                  {column.label}
                </h2>
                <ul className={styles.columnLinks}>
                  {column.items?.map((item) => (
                    <li key={item.id || item.name}>
                      <Link
                        className={styles.menuLink}
                        href={item.link}
                        aria-current={isCurrentLink(item.link) ? "page" : undefined}
                        onClick={onClose}
                      >
                        <span>{item.name}</span>
                        {item.description && <span className={styles.menuLinkMeta}>{item.description}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default BurgerMenu;

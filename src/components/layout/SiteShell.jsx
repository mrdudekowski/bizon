"use client";

import BurgerMenu from "@/components/BurgerMenu/BurgerMenu.jsx";
import { BackToTop } from "@/components/BackToTop/BackToTop.jsx";
import { Header } from "@/components/Header/Header.jsx";
import { Footer } from "@/components/Footer/Footer.jsx";
import { useMenuToggle } from "@/hooks/useMenuToggle";
import { scrollToTop } from "@/lib/scroll";

/**
 * Client shell: header, burger menu, footer, scroll helpers.
 * Wraps all public site pages.
 */
export function SiteShell({ children, menuItems }) {
  const { menuOpen, closeMenu, toggleMenu } = useMenuToggle();

  return (
    <>
      <div className={`page ${menuOpen ? "page--blurred" : ""}`}>
        <a className="skip-link" href="#main">
          Перейти к контенту
        </a>

        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />

        <main id="main">{children}</main>

        <Footer />

        <BackToTop onScrollToTop={scrollToTop} />
      </div>

      <BurgerMenu isOpen={menuOpen} onClose={closeMenu} menuItems={menuItems} />
    </>
  );
}

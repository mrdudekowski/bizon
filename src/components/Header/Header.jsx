"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BurgerToggle from "../BurgerToggle/BurgerToggle.jsx";
import { CartHeaderButton } from "@/components/cart/CartHeaderButton";
import { HEADER_NAV, ROUTES } from "@/constants/navigation";

/**
 * Компонент хедера сайта
 * Содержит навигацию, логотип и кнопку контакта
 */
export const Header = ({ menuOpen, onMenuToggle, cartCount = 0, onCartOpen }) => {
  const pathname = usePathname();
  const isShop = pathname === ROUTES.shop || pathname.startsWith(`${ROUTES.shop}/`);

  return (
    <header className={`site-header${isShop ? " site-header--shop" : ""}`}>
      <div className="navbar">
        <div className="burger-button">
          <BurgerToggle isOpen={menuOpen} onToggle={onMenuToggle} />
        </div>

        {!isShop && (
          <Link className="brand" href={ROUTES.home} aria-label="Bizon Tires — на главную">
            <span className="brand-wordmark" translate="no">BIZON</span>
            <span className="brand-descriptor">Heavy Duty</span>
          </Link>
        )}

        <div className="nav-actions">
          {onCartOpen && <CartHeaderButton count={cartCount} onOpen={onCartOpen} />}
          {!isShop && (
            <>
              <nav className="desktop-nav" aria-label="Основная навигация">
                {HEADER_NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link href={ROUTES.contact} className="contact-button">
                Запросить расчёт
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

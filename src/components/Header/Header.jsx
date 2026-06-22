import Link from "next/link";
import BurgerToggle from "../BurgerToggle/BurgerToggle.jsx";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.jsx";
import { HEADER_NAV, ROUTES } from "@/constants/navigation";

/**
 * Компонент хедера сайта
 * Содержит навигацию, логотип и кнопку контакта
 */
export const Header = ({ menuOpen, onMenuToggle }) => {
  return (
    <header className="site-header">
      <div className="navbar">
        <div
          className="burger-button"
          aria-expanded={menuOpen}
          aria-controls="burger-menu"
        >
          <BurgerToggle isOpen={menuOpen} onToggle={onMenuToggle} />
        </div>

        <Link className="brand" href={ROUTES.home} aria-label="Bizon Tires — на главную">
          <img
            src="/bizon_inverted_hd.svg"
            alt="Bizon Tires"
            className="brand-logo"
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
          />
        </Link>

        <div className="nav-actions">
          <ThemeToggle />
          <nav className="desktop-nav" aria-label="Основная навигация">
            {HEADER_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href={ROUTES.contact} className="contact-button">
            Связаться
          </Link>
        </div>
      </div>
    </header>
  );
};

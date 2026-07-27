import ProductCarousel from "../ProductCarousel/ProductCarousel.jsx";
import { SECTIONS } from "@/constants/sections";

/**
 * Секция категорий шин — тёмный cinematic блок
 */
export const ProductsSection = ({ tireTypes = [] }) => {
  return (
    <section id={SECTIONS.PRODUCTS} className="section section--dark">
      <div className="section-inner">
        <div className="section-heading">
          <p className="section-kicker">Каталог</p>
          <h2 className="section-title">Решения по условиям эксплуатации</h2>
          <p className="section-description">
            Магистраль, региональные маршруты, карьер и смешанная эксплуатация.
          </p>
        </div>
        <ProductCarousel items={tireTypes} />
      </div>
    </section>
  );
};

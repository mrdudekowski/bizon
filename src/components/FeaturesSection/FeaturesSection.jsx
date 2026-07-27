import Image from "next/image";

import { PREMIUM_MEDIA } from "@/constants/images";
import { SECTIONS } from "@/constants/sections";

/**
 * Секция преимуществ — светлый premium grid
 */
export const FeaturesSection = () => {
  const features = [
    {
      index: "01",
      image: PREMIUM_MEDIA.inspection,
      imageAlt: "Проверка глубины протектора грузовой шины",
      title: "Надёжность",
      description:
        "Конструкции для экстремальных нагрузок: карьеры, магистрали, бездорожье.",
    },
    {
      index: "02",
      image: PREMIUM_MEDIA.consultation,
      imageAlt: "Специалисты анализируют параметры грузовой шины",
      title: "Экономичность",
      description:
        "Оптимальный ресурс пробега и снижение простоев автопарка.",
    },
    {
      index: "03",
      image: PREMIUM_MEDIA.mounting,
      imageAlt: "Монтаж грузовой шины на профессиональном оборудовании",
      title: "Сервис",
      description:
        "Подбор, поставки и сопровождение — от консультации до брендирования резины.",
    },
  ];

  return (
    <section id={SECTIONS.FEATURES} className="section section--muted">
      <div className="section-heading">
        <p className="section-kicker">Инженерный подход</p>
        <h2 className="section-title">Почему BIZON</h2>
        <p className="section-description">
          Решение под задачу автопарка: от подбора до поставки и сопровождения.
        </p>
      </div>
      <div className="section-grid">
        {features.map((feature) => (
          <article key={feature.title} className="card-base info-card feature-card">
            <div className="feature-card__media">
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="feature-card__body">
              <span className="feature-card__index" aria-hidden="true">{feature.index}</span>
              <h3 className="info-card-title">{feature.title}</h3>
              <p className="info-card-text">{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

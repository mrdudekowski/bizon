"use client";

import Image from "next/image";

import { SECTIONS } from "@/constants/sections";
import { PREMIUM_MEDIA } from "@/constants/images";
import { useScrollToSection } from "@/hooks/useScrollToSection";

/**
 * Cinematic hero — premium industrial first screen
 */
export const Hero = () => {
  const scrollToSection = useScrollToSection();

  return (
    <section id={SECTIONS.HERO} className="hero">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-media-bg">
          <Image
            src={PREMIUM_MEDIA.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-media-image"
          />
        </div>
        <div className="hero-overlay" />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <p className="eyebrow">BIZON · шины для коммерческого транспорта</p>
          <h1>Ресурс, который работает на маршруте</h1>
          <p className="hero-text">
            Подбор шин для магистралей, региональных перевозок, карьеров и
            бездорожья. Решение под технику, ось и условия эксплуатации.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn-accent"
              onClick={() => scrollToSection(SECTIONS.PRODUCTS)}
            >
              Подобрать шины
            </button>
            <button
              type="button"
              className="btn-glass"
              onClick={() => scrollToSection(SECTIONS.FEATURES)}
            >
              Смотреть решения
            </button>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true" />
    </section>
  );
};

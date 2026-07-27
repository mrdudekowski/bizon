import Image from "next/image";
import Link from "next/link";

import { PREMIUM_MEDIA } from "@/constants/images";
import { SECTIONS } from "@/constants/sections";

/**
 * Баннер перехода к дискам и аксессуарам.
 */
export const AccessoriesSection = () => {
  return (
    <section
      id={SECTIONS.ACCESSORIES}
      className="section"
      aria-labelledby="accessories-heading"
    >
      <div className="accessories-banner">
        <div className="accessories-banner-media" aria-hidden="true">
          <Image
            src={PREMIUM_MEDIA.forgedWheel}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 92vw"
            className="accessories-banner-image"
          />
        </div>
        <div className="accessories-banner-overlay" aria-hidden="true" />
        <div className="accessories-banner-content">
          <p className="section-kicker">BIZON Equipment</p>
          <h2 id="accessories-heading">Диски и оснащение для вашего парка</h2>
          <p>Кованые диски и аксессуары для коммерческого транспорта.</p>
          <Link
            href="/shop"
            className="btn-secondary btn-secondary--inverse"
          >
            Перейти в BIZON Shop
          </Link>
        </div>
      </div>
    </section>
  );
};

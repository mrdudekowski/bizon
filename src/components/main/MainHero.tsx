import Image from "next/image";
import Link from "next/link";

import type { HomeHeroContent } from "@/lib/cms/pages/types";

import styles from "./MainHome.module.css";

export function MainHero({ content }: { content: HomeHeroContent }) {
  return (
    <section className={styles.hero} data-main-chrome-tone="dark">
      <div className={styles.heroMedia}>
        <Image
          src={content.imageUrl}
          alt={content.imageAlt}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.lead}</p>
          <div className={styles.actions}>
            <Link className="btn-accent" href={content.primaryCta.href}>
              {content.primaryCta.label}
            </Link>
            <Link className="btn-secondary" href={content.secondaryCta.href}>
              {content.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div className={styles.heroMetric}>
          <span>{content.metricLabel}</span>
          <p>{content.metricText}</p>
        </div>
      </div>
    </section>
  );
}

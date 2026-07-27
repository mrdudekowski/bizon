import Image from "next/image";
import Link from "next/link";

import { PREMIUM_MEDIA } from "@/constants/images";

import styles from "./MainHome.module.css";

export function BrandingCampaign() {
  return <div className={styles.branding}><div className={styles.inner}><div className={styles.brandingMedia}><Image src={PREMIUM_MEDIA.fleetManager} alt="Менеджер автопарка BIZON" fill sizes="(max-width: 767px) 100vw, 45vw" /></div><div className={styles.brandingCopy}><p className={styles.eyebrow}>Для автопарков и дилеров</p><h3>Индивидуальное брендирование</h3><p>Единая визуальная программа для корпоративного парка: от маркировки до согласованной поставки.</p><ul><li>Идентификация партии и техники</li><li>Согласование под корпоративный стандарт</li><li>Сопровождение проекта одной командой</li></ul><Link className="btn-accent" href="/branding">Обсудить проект</Link></div></div></div>;
}

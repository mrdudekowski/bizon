import Image from "next/image";

import { PREMIUM_MEDIA } from "@/constants/images";
import { SECTIONS } from "@/constants/sections";
import {
  SITE_CONTACT,
  contactEmailHref,
  contactPhoneHref,
} from "@/constants/contact";

/**
 * Секция контактов
 */
export const ContactSection = () => {
  const contacts = [
    {
      title: "Телефон",
      text: SITE_CONTACT.phone,
      href: contactPhoneHref(),
    },
    {
      title: "Email",
      text: SITE_CONTACT.email,
      href: contactEmailHref(),
    },
    {
      title: "География",
      text: SITE_CONTACT.geography,
    },
  ];

  return (
    <section id={SECTIONS.CONTACT} className="section contact-section">
      <div className="section-heading">
        <p className="section-kicker">Связаться с BIZON</p>
        <h2 className="section-title">Обсудим задачу вашего автопарка</h2>
        <p className="section-description">
          Подберём шины, проверим параметры и подготовим расчёт.
        </p>
      </div>
      <div className="contact-section__media">
        <Image
          src={PREMIUM_MEDIA.fleetManager}
          alt="Специалист автопарка проверяет данные грузовых автомобилей"
          fill
          sizes="(max-width: 768px) 100vw, 92vw"
        />
      </div>
      <div className="section-grid">
        {contacts.map((contact) => (
          <article key={contact.title} className="card-base info-card">
            <h3 className="info-card-title">{contact.title}</h3>
            {contact.href ? (
              <a href={contact.href} className="info-card-text underline">
                {contact.text}
              </a>
            ) : (
              <p className="info-card-text">{contact.text}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

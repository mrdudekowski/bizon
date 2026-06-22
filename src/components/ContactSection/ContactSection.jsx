import { SECTIONS } from "@/constants/sections";

/**
 * Секция контактов
 */
export const ContactSection = () => {
  const contacts = [
    {
      title: "Телефон",
      text: "+7 (000) 000-00-00",
    },
    {
      title: "Email",
      text: "info@bizontires.example",
    },
    {
      title: "География",
      text: "Работаем по всей стране — поставки для автопарков.",
    },
  ];

  return (
    <section id={SECTIONS.CONTACT} className="section">
      <h2 className="section-title">Контакты</h2>
      <p className="section-description">
        Свяжитесь с нами для расчёта, подбора шин или консультации по парку.
      </p>
      <div className="section-grid">
        {contacts.map((contact) => (
          <article key={contact.title} className="card-base info-card">
            <h3 className="info-card-title">{contact.title}</h3>
            <p className="info-card-text">{contact.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

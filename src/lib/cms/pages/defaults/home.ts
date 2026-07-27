import { PREMIUM_MEDIA } from "@/constants/images";

import type { HomePageContent } from "../types";

export const HOME_PAGE_DEFAULTS: HomePageContent = {
  key: "home",
  seoTitle: undefined,
  seoDescription: undefined,
  hero: {
    eyebrow: "BIZON TIRES · PROFESSIONAL SERIES",
    title: "Ресурс для реальной работы",
    lead: "Шины для коммерческого транспорта и тяжёлой техники — с понятным подбором по задаче, маршруту и нагрузке.",
    imageUrl: PREMIUM_MEDIA.hero,
    imageAlt: "Грузовой автопарк на магистрали",
    primaryCta: { label: "Подобрать шины", href: "/#solutions" },
    secondaryCta: { label: "Изучить каталог", href: "/models" },
    metricLabel: "01",
    metricText: "От задачи автопарка — к проверяемой рекомендации",
  },
  selectionEntry: {
    eyebrow: "Начать с задачи",
    title: "Для какой техники нужны шины?",
    lead: "Выберите направление — первый ответ уже будет сохранён в подборе.",
  },
  directions: {
    eyebrow: "Опубликованный ассортимент",
    title: "Шины под рабочую среду",
    lead: "Каждое направление уже содержит модели для изучения. Конкретный типоразмер и наличие подтверждает специалист.",
  },
  expertise: {
    eyebrow: "Практика и опыт",
    title: "Экспертиза и поддержка",
    lead: "Tire IQ, опыт эксплуатации и решения для корпоративных проектов.",
  },
  shopCampaign: {
    eyebrow: "Вторая поверхность BIZON",
    title: "BIZON Shop",
    lead: "Кованые диски и предметы для тех, кто воспринимает технику как часть собственного характера.",
    imageUrl: PREMIUM_MEDIA.shopHero,
    imageAlt: "Кованый диск BIZON",
    cta: { label: "Перейти в BIZON Shop", href: "/shop" },
  },
  resume: {
    eyebrow: "Готовы начать?",
    title: "Три ответа до предварительной рекомендации",
    lead: "Подбор не заменяет инженерную проверку — он помогает передать специалисту уже структурированную задачу.",
    primaryCta: { label: "Подобрать шины", href: "/#solutions" },
    secondaryCta: { label: "Связаться напрямую", href: "/contact" },
  },
};

import { ServicePage } from "@/components/content/ServicePage";
import { PREMIUM_MEDIA } from "@/constants/images";
import { ROUTES } from "@/constants/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Индивидуальное брендирование",
  description: "Обсудите проект индивидуального брендирования для шин и профессионального транспорта.",
  path: "/branding",
});

export default function BrandingPage() {
  return (
    <ServicePage
      kicker="BIZON Business"
      title="Индивидуальное брендирование"
      description="Единая визуальная программа для корпоративного парка: от постановки задачи до согласованной поставки."
      breadcrumbs={[
        { href: ROUTES.home, label: "Главная" },
        { href: ROUTES.branding, label: "Брендирование" },
      ]}
      media={{ src: PREMIUM_MEDIA.fleetManager, alt: "Корпоративный автопарк BIZON" }}
      featuresHeading="Как начинается проект"
      features={[
        {
          title: "Задача и сценарий эксплуатации",
          text: "Собираем вводные о технике, условиях работы и целях брендирования.",
        },
        {
          title: "Подбор решения",
          text: "Формируем предложение на основе доступной номенклатуры и согласованных параметров проекта.",
        },
        {
          title: "План реализации",
          text: "После уточнения исходных данных согласуем объём, сроки и дальнейший порядок работы.",
        },
      ]}
      proof={{
        src: PREMIUM_MEDIA.mounting,
        alt: "Работа с шиной в сервисной зоне",
        title: "Маркировка как часть рабочей поставки",
        text: "Брендирование обсуждается вместе с подбором и логистикой — без обещаний сроков до проверки исходных данных.",
      }}
      cta={{
        href: `${ROUTES.contact}?subject=branding`,
        label: "Обсудить проект",
      }}
    />
  );
}

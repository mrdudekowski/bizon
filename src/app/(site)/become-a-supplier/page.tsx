import { ServicePage } from "@/components/content/ServicePage";
import { PREMIUM_MEDIA } from "@/constants/images";
import { ROUTES } from "@/constants/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Стать поставщиком",
  description: "Обсудите сотрудничество с BIZON в сфере грузовых шин и решений для автопарков.",
  path: "/become-a-supplier",
});

export default function BecomeASupplierPage() {
  return (
    <ServicePage
      kicker="Партнёрство"
      title="Стать поставщиком"
      description="Начните диалог о поставках, ассортименте и работе с профессиональным рынком грузовых шин."
      breadcrumbs={[
        { href: ROUTES.home, label: "Главная" },
        { href: ROUTES.supplier, label: "Стать поставщиком" },
      ]}
      media={{ src: PREMIUM_MEDIA.mixedService, alt: "Техника в смешанных условиях эксплуатации" }}
      featuresHeading="Как проходит первичное обращение"
      features={[
        {
          title: "Расскажите о компании",
          text: "Укажите регион, направление работы и профиль клиентов — это поможет подготовить предметный ответ.",
        },
        {
          title: "Обсудим формат",
          text: "Согласуем номенклатуру, потребности автопарков и возможный формат сотрудничества.",
        },
        {
          title: "Подготовим следующий шаг",
          text: "Менеджер свяжется, чтобы уточнить детали и определить дальнейший порядок работы.",
        },
      ]}
      proof={{
        src: PREMIUM_MEDIA.severeService,
        alt: "Тяжёлые условия эксплуатации коммерческой техники",
        title: "Работаем с профессиональным рынком",
        text: "Заявка не создаёт обязательств автоматически: коммерческие условия и регионы подтверждаются отдельно.",
      }}
      cta={{
        href: `${ROUTES.contact}?subject=supplier`,
        label: "Оставить заявку",
      }}
    />
  );
}

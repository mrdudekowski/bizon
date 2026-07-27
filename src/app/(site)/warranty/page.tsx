import { DemoContentNotice } from "@/components/content/DemoContentNotice";
import { ServicePage } from "@/components/content/ServicePage";
import { PREMIUM_MEDIA } from "@/constants/images";
import { ROUTES } from "@/constants/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Гарантия",
  description:
    "Как подготовить обращение по гарантии на шины BIZON и какие данные понадобятся для первичной проверки.",
  path: ROUTES.warranty,
});

export default function WarrantyPage() {
  return (
    <ServicePage
      kicker="Поддержка"
      title="Гарантия и обращение"
      description="Порядок первичного обращения по гарантийному вопросу. Финальные сроки и объём условий подтверждает поставщик."
      breadcrumbs={[
        { href: ROUTES.home, label: "Главная" },
        { href: ROUTES.warranty, label: "Гарантия" },
      ]}
      media={{ src: PREMIUM_MEDIA.inspection, alt: "Проверка протектора шины" }}
      notice={
        <DemoContentNotice>
          Пример ниже не устанавливает срок или объём гарантии. Перед запуском его заменяют условия
          поставщика и подтверждающие документы.
        </DemoContentNotice>
      }
      featuresHeading="Три шага для первичной проверки"
      features={[
        {
          title: "Зафиксируйте данные",
          text: "Подготовьте модель и размер шины, дату и место приобретения, пробег, положение на технике и описание ситуации.",
        },
        {
          title: "Приложите материалы",
          text: "Сделайте фотографии шины, маркировки и зоны проверки. Не утилизируйте изделие до ответа менеджера.",
        },
        {
          title: "Отправьте запрос",
          text: "Опишите случай в форме контактов. Менеджер вернётся с перечнем документов и дальнейшим порядком рассмотрения.",
        },
      ]}
      proof={{
        src: PREMIUM_MEDIA.consultation,
        alt: "Консультация специалиста BIZON",
        title: "Что обычно фиксируется в гарантии",
        text: "В финальной версии указывают продавца или поставщика, модели, срок и объём гарантии, исключения, процедуру экспертизы и каналы обращения.",
      }}
      cta={{
        href: `${ROUTES.contact}?subject=warranty`,
        label: "Задать вопрос по гарантии",
      }}
    />
  );
}

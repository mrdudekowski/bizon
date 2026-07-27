import { ServicePage } from "@/components/content/ServicePage";
import { PREMIUM_MEDIA } from "@/constants/images";
import { ROUTES } from "@/constants/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "О компании",
  description: "BIZON помогает автопаркам выбрать шины и организовать поставку под условия эксплуатации.",
  path: ROUTES.about,
});

export default function AboutPage() {
  return (
    <ServicePage
      kicker="BIZON · Heavy Duty"
      title="О компании BIZON"
      description="Помогаем автопаркам подобрать шины под технику, маршрут и нагрузку — и передать запрос специалистам без лишних обещаний."
      breadcrumbs={[
        { href: ROUTES.home, label: "Главная" },
        { href: ROUTES.about, label: "О компании" },
      ]}
      media={{ src: PREMIUM_MEDIA.highwayCategory, alt: "Коммерческий автопарк на маршруте" }}
      featuresHeading="Как мы работаем"
      features={[
        {
          title: "Подбор по задаче",
          text: "Каталог TBR и OTR строится вокруг техники и условий эксплуатации — без имитации фильтров, которых ещё нет в данных.",
        },
        {
          title: "B2B-коммуникация",
          text: "Заявка передаёт менеджеру контакты и контекст задачи. Условия поставки и наличие типоразмера подтверждаются индивидуально.",
        },
        {
          title: "Проверенный ассортимент",
          text: "На сайте публикуются только направления и модели с готовыми страницами. Пустые витрины и демонстрационные остатки не показываем.",
        },
      ]}
      proof={{
        src: PREMIUM_MEDIA.consultation,
        alt: "Консультация по подбору шин для автопарка",
        title: "От задачи парка — к проверяемой рекомендации",
        text: "Предварительный подбор помогает сузить направление. Финальную совместимость и наличие подтверждает специалист BIZON.",
      }}
      cta={{
        href: ROUTES.selectionEntry,
        label: "Подобрать шины",
        secondaryHref: ROUTES.contact,
        secondaryLabel: "Связаться напрямую",
      }}
    />
  );
}

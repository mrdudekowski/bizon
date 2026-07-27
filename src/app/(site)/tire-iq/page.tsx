import { EditorialListing } from "@/components/content/EditorialListing";
import { getTireIQArticles } from "@/lib/cms";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Tire IQ",
  description: "Экспертные материалы о подборе и эксплуатации большегрузной резины.",
  path: "/tire-iq",
});

export default async function TireIQPage() {
  const articles = await getTireIQArticles();

  return (
    <EditorialListing
      kicker="Знания и практика"
      title="Tire IQ"
      description="Методики подбора и эксплуатации шин для fleet-операторов и технических специалистов."
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/tire-iq", label: "Tire IQ" },
      ]}
      items={articles.map((article) => ({
        key: article.slug,
        href: `/tire-iq/${article.slug}`,
        title: article.title,
        description: article.excerpt,
        meta: article.publishedAt,
        imageUrl: article.imageUrl,
        imageAlt: article.title,
        fallbackKey: article.slug,
      }))}
      emptyMessage="Опубликованных статей Tire IQ пока нет."
    />
  );
}

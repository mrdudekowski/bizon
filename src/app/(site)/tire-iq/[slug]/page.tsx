import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTireIQSlugs, getTireIQArticleBySlug } from "@/lib/cms";
import { createPageMetadata } from "@/lib/seo/metadata";
import { PageHeader } from "@/components/catalog/PageHeader";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllTireIQSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getTireIQArticleBySlug(slug);
  if (!article) return {};
  return createPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/tire-iq/${article.slug}`,
  });
}

export default async function TireIQArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getTireIQArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="section-inner">
      <PageHeader
        title={article.title}
        description={article.excerpt}
        breadcrumbs={[
          { href: "/", label: "Главная" },
          { href: "/tire-iq", label: "Tire IQ" },
          { href: `/tire-iq/${article.slug}`, label: article.title },
        ]}
      />
      <article className="card-base info-card max-w-3xl">
        <p className="text-sm text-muted mb-4">{article.publishedAt}</p>
        <p className="info-card-text">
          Полный текст статьи будет загружен из Payload CMS (Tire IQ collection).
        </p>
      </article>
      <p className="mt-8">
        <Link href="/tire-iq" className="btn-glass inline-flex">
          ← Все статьи
        </Link>
      </p>
    </div>
  );
}

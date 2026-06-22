import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  getAllTireModelRouteParams,
  getTireModelByTypeAndSlug,
  getTireTypeBySlug,
  getTireVariantsByModelId,
} from "@/lib/cms";
import { getApplicationCategoryLabel } from "@/lib/cms/applicationCategory";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createProductStructuredData } from "@/lib/seo/structuredData";
import { PageHeader } from "@/components/catalog/PageHeader";
import { TireVariantsTable } from "@/components/catalog/TireVariantsTable";
import { AddToCartSection } from "@/components/cart/AddToCartSection";
import { QuickOrderSection } from "@/components/forms/QuickOrderSection";
type PageProps = {
  params: Promise<{ tireTypeSlug: string; modelSlug: string }>;
};

export async function generateStaticParams() {
  return getAllTireModelRouteParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { tireTypeSlug, modelSlug } = await params;
  const model = await getTireModelByTypeAndSlug(tireTypeSlug, modelSlug);
  if (!model) return {};
  return createPageMetadata({
    title: model.name,
    description: model.descriptionShort,
    path: `/models/${model.tireTypeSlug}/${model.slug}`,
  });
}

export default async function TireModelPage({ params }: PageProps) {
  const { tireTypeSlug, modelSlug } = await params;
  const [tireType, model] = await Promise.all([
    getTireTypeBySlug(tireTypeSlug),
    getTireModelByTypeAndSlug(tireTypeSlug, modelSlug),
  ]);

  if (!tireType || !model) {
    notFound();
  }

  const variants = await getTireVariantsByModelId(model.id);
  const typeBasePath = `/models/${tireType.slug}`;
  const modelPath = `${typeBasePath}/${model.slug}`;

  const structuredData = createProductStructuredData({
    name: model.name,
    description: model.descriptionShort,
    path: modelPath,
    brand: model.brand,
    category: tireType.name,
  });

  const metaParts = [
    model.brand,
    getApplicationCategoryLabel(model.applicationCategory),
    model.axlePosition,
    model.treadType,
  ].filter(Boolean);

  return (
    <div className="section-inner">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageHeader
        title={model.name}
        description={model.descriptionShort}
        breadcrumbs={[
          { href: "/", label: "Главная" },
          { href: "/models", label: "Модели" },
          { href: typeBasePath, label: tireType.name },
          { href: modelPath, label: model.name },
        ]}
      />
      {metaParts.length > 0 && (
        <p className="text-sm text-muted mb-4">{metaParts.join(" · ")}</p>
      )}
      <article className="card-base info-card max-w-3xl">
        <p className="info-card-text">{model.descriptionLong}</p>
        {model.application && (
          <p className="info-card-text mt-4">
            <span className="text-muted">Применение: </span>
            {model.application}
          </p>
        )}
      </article>

      <TireVariantsTable model={model} variants={variants} modelPath={modelPath} />

      <Suspense fallback={null}>
        <AddToCartSection
          baseItem={{
            itemType: "tire",
            itemId: model.id,
            name: model.name,
            slug: model.slug,
            parentSlug: model.tireTypeSlug,
            url: modelPath,
            quantity: 1,
            priceOnRequest: true,
          }}
          variants={variants.map((variant) => ({ id: variant.id, label: variant.size }))}
        />
      </Suspense>

      <Suspense fallback={null}>
        <QuickOrderSection
          baseItem={{
            itemType: "tire",
            itemId: model.id,
            name: model.name,
            slug: model.slug,
            parentSlug: model.tireTypeSlug,
            url: modelPath,
            quantity: 1,
            priceOnRequest: true,
          }}
          variants={variants.map((variant) => ({ id: variant.id, label: variant.size }))}
        />
      </Suspense>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/contact" className="btn-accent inline-flex">
          Запросить цену
        </Link>
        <Link href={typeBasePath} className="btn-glass inline-flex">
          ← Все модели {tireType.name}
        </Link>
      </div>
    </div>
  );
}

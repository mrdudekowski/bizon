import Link from "next/link";

export function CatalogCard({ href, title, description, meta = null }) {
  return (
    <article className="card-base info-card">
      <h2 className="info-card-title">
        <Link href={href}>{title}</Link>
      </h2>
      {meta && <p className="text-sm text-muted mb-2">{meta}</p>}
      {description && <p className="info-card-text">{description}</p>}
    </article>
  );
}

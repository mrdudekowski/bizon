import Link from "next/link";

export function PageHeader({ title, description, breadcrumbs = [] }) {
  return (
    <header className="page-header">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            {breadcrumbs.map((item, index) => (
              <li key={item.href}>
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>
                  {item.label}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="section-title">{title}</h1>
      {description && <p className="section-description">{description}</p>}
    </header>
  );
}

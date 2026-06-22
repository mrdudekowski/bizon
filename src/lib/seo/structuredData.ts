import { getSiteUrl } from "./metadata";

export type ProductStructuredDataInput = {
  name: string;
  description?: string;
  slug: string;
  brand?: string;
  category?: string;
};

/** JSON-LD placeholder — extend when Payload product schema is ready */
export function createProductStructuredData(product: ProductStructuredDataInput) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand ?? "BIZON",
    },
    category: product.category,
    url: `${siteUrl}/shop/product/${product.slug}`,
  };
}

export function createOrganizationStructuredData() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bizon Tires",
    url: siteUrl,
    logo: `${siteUrl}/bizon_inverted_hd.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@bizontires.example",
      availableLanguage: ["Russian"],
    },
  };
}

import { redirect } from "next/navigation";

import { selectionLegacyToHomePath } from "@/lib/selection/homeHref";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQueryString(
  source: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value != null) params.set(key, value);
  }
  return params.toString();
}

export default async function SelectionPage({ searchParams }: PageProps) {
  const query = toQueryString(await searchParams);
  redirect(selectionLegacyToHomePath(query));
}

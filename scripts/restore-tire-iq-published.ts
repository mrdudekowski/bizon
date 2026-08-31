import { getPayload } from "../src/lib/payload/getPayload";

const payload = await getPayload();
const slugs = [
  "cold-inflation-pressure-check",
  "how-to-read-tire-size-marking",
  "load-and-inflation-engineering-relationship",
];

for (const slug of slugs) {
  const result = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const article = result.docs[0];
  if (!article) throw new Error(`Missing article: ${slug}`);
  await payload.update({
    collection: "tire-iq-articles",
    id: article.id,
    data: { status: "published", publishedAt: article.publishedAt ?? new Date().toISOString() },
  });
  console.log(`Published: ${slug}`);
}

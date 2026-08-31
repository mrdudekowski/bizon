import { getPayload } from "../src/lib/payload/getPayload";

const payload = await getPayload();
const result = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: "drive-axle-tire-selection" } }, limit: 1, depth: 0 });
const article = result.docs[0];
if (!article) throw new Error("Article not found");
await payload.update({ collection: "tire-iq-articles", id: article.id, data: { status: "published", publishedAt: article.publishedAt ?? new Date().toISOString() } });
console.log("Published: drive-axle-tire-selection");

import { getPayload } from "../src/lib/payload/getPayload";

const text = (value: string) => ({ type: "text" as const, detail: 0, format: 0, mode: "normal" as const, style: "", text: value, version: 1 as const });
const paragraph = (value: string) => ({ type: "paragraph" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] });
const heading = (value: string) => ({ type: "heading" as const, tag: "h2" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] });
const list = (items: string[]) => ({ type: "list" as const, listType: "bullet" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, start: 1, tag: "ul" as const, children: items.map((item) => ({ type: "listitem" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, value: 1, children: [paragraph(item)] })) });

const slug = "drive-axle-tire-selection";
const content = {
  root: {
    type: "root" as const, format: "", indent: 0, version: 1, direction: "ltr" as const,
    children: [
      paragraph("Ведущая ось передаёт тягу от двигателя к покрытию, поэтому подбор шины начинается не с рисунка протектора, а с фиксации условий работы автомобиля и требований конкретной техники."),
      heading("Какие данные собрать"),
      list(["Размер и полное обозначение шины, включая индексы нагрузки и скорости.", "Фактическую нагрузку на ведущую ось и конфигурацию колёс.", "Тип покрытия, долю мокрых и грунтовых участков, уклоны и частоту манёвров.", "Историю износа и повторяющиеся повреждения на этой позиции."]),
      heading("Что оценивать на ведущей оси"),
      paragraph("Для ведущей оси важны передача тяги, устойчивость элементов протектора к сдвигу и равномерность контакта. Один и тот же рисунок может вести себя по-разному при изменении нагрузки, покрытия, давления и режима движения."),
      heading("Как сравнивать варианты"),
      paragraph("Сначала исключите варианты, которые не соответствуют размеру, нагрузке, ободу или требованиям автомобиля. Затем сравнивайте оставшиеся решения по подтверждённому назначению, условиям маршрута и наблюдаемому износу, а не по одному визуальному признаку."),
      heading("Когда нужна проверка специалиста"),
      paragraph("Если нагрузка неизвестна, давление заметно отличается между колёсами, есть повреждение каркаса или шина работает вне привычного режима, решение нужно подтвердить техническим специалистом до изменения комплектации."),
    ],
  },
};

const payload = await getPayload();
const existing = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
const data: any = {
  title: "Как подбирать шину для ведущей оси",
  slug,
  excerpt: "Практический алгоритм оценки условий работы и требований к шине на ведущей оси.",
  taxonomy: ["axles", "selection", "load", "diagnostics"] as const,
  content,
  status: "draft" as const,
};

if (existing.docs[0]) {
  await payload.update({ collection: "tire-iq-articles", id: existing.docs[0].id, data });
  console.log(`Updated draft: ${slug}`);
} else {
  await payload.create({ collection: "tire-iq-articles", data });
  console.log(`Created draft: ${slug}`);
}

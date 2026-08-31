import { getPayload } from "../src/lib/payload/getPayload";

const text = (value: string) => ({ type: "text" as const, detail: 0, format: 0, mode: "normal" as const, style: "", text: value, version: 1 as const });
const paragraph = (value: string) => ({ type: "paragraph" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] });
const heading = (value: string) => ({ type: "heading" as const, tag: "h2" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] });
const list = (items: string[]) => ({ type: "list" as const, listType: "bullet" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, start: 1, tag: "ul" as const, children: items.map((item) => ({ type: "listitem" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, value: 1, children: [paragraph(item)] })) });

const slug = "tbr-pre-trip-tire-inspection";
const content = { root: { type: "root" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [
  paragraph("Предрейсовый осмотр помогает заметить повреждение, потерю давления или изменение состояния до выхода техники на маршрут. Это первичный контроль, а не замена профессиональной диагностике."),
  heading("Осмотр до начала движения"),
  list(["Проверьте боковины, протектор, видимые порезы, вздутия и следы контакта.", "Сравните положение шины с записью в журнале и проверьте, не было ли недавней перестановки.", "Измерьте давление на холодной шине по норме для конкретной модели, нагрузки и конфигурации.", "Осмотрите вентиль, колпачок, обод и пространство между шинами при сдвоенной установке."]),
  heading("Что зафиксировать"),
  paragraph("Запишите дату, позицию, показание давления, замеченные повреждения и решение по дальнейшей эксплуатации. Фотография и повторное измерение помогают сравнивать состояние во времени."),
  heading("Когда нельзя продолжать движение"),
  paragraph("Повреждение каркаса или боковины, быстрое падение давления, контакт в сдвоенной установке, выраженный перегрев или сомнение в безопасности требуют остановки и осмотра специалистом."),
  heading("Ограничение чек-листа"),
  paragraph("Внешний осмотр не подтверждает пригодность шины к дальнейшей эксплуатации и не задаёт универсальную норму давления. Числовые значения нужно брать из документации конкретной шины и автомобиля."),
] } };

const payload = await getPayload();
const result = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
const data: any = { title: "Предрейсовый осмотр TBR-шин: короткий чек-лист", slug, excerpt: "Что проверить и зафиксировать до выхода грузовой техники на маршрут.", taxonomy: ["diagnostics", "pressure", "wear", "axles"], content, status: "draft" as const };
if (result.docs[0]) { await payload.update({ collection: "tire-iq-articles", id: result.docs[0].id, data }); console.log(`Updated draft: ${slug}`); }
else { await payload.create({ collection: "tire-iq-articles", data }); console.log(`Created draft: ${slug}`); }

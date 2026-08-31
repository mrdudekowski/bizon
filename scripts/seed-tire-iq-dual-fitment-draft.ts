import { getPayload } from "../src/lib/payload/getPayload";

const text = (value: string) => ({ type: "text" as const, detail: 0, format: 0, mode: "normal" as const, style: "", text: value, version: 1 as const });
const paragraph = (value: string) => ({ type: "paragraph" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] });
const heading = (value: string) => ({ type: "heading" as const, tag: "h2" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] });
const list = (items: string[]) => ({ type: "list" as const, listType: "bullet" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, start: 1, tag: "ul" as const, children: items.map((item) => ({ type: "listitem" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, value: 1, children: [paragraph(item)] })) });

const slug = "dual-fitment-tire-check";
const content = { root: { type: "root" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [
  paragraph("Сдвоенная установка требует контроля не только каждой шины, но и пары как единой рабочей системы. Разница в состоянии, давлении или эффективном диаметре может менять распределение нагрузки между шинами."),
  heading("Что проверить при установке"),
  list(["Совпадение размера, конструкции и допустимой конфигурации установки.", "Состояние обеих шин, вентилей, обода и пространства между боковинами.", "Отсутствие заметной разницы по давлению и признаков повторной потери воздуха.", "Корректность монтажа и отсутствие контакта между шинами или с элементами техники."]),
  heading("Контроль в эксплуатации"),
  paragraph("Проверяйте пару вместе: фиксируйте положение, давление на холодной шине, глубину протектора и изменение износа. Если одна шина заметно перегревается или изнашивается быстрее, не ограничивайтесь заменой показаний в журнале — ищите причину."),
  heading("Чего нельзя делать"),
  paragraph("Нельзя компенсировать неизвестную причину случайным изменением давления или смешивать несовместимые шины без подтвержденной рекомендации. Норму нужно брать из документации конкретной шины, оси и автомобиля."),
  heading("Когда остановить эксплуатацию"),
  paragraph("При повреждении боковины, контакте шин, повторной потере давления или выраженной разнице температур нужна проверка специалиста до продолжения работы."),
] } };

const payload = await getPayload();
const result = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
const data: any = { title: "Сдвоенная установка: как контролировать пару шин", slug, excerpt: "Практический чек-лист контроля шин при сдвоенной установке.", taxonomy: ["axles", "diagnostics", "pressure", "wear"], content, status: "draft" as const };
if (result.docs[0]) { await payload.update({ collection: "tire-iq-articles", id: result.docs[0].id, data }); console.log(`Updated draft: ${slug}`); }
else { await payload.create({ collection: "tire-iq-articles", data }); console.log(`Created draft: ${slug}`); }

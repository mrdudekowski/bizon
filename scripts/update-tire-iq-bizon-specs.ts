import type { Payload } from "payload";

import { getPayload } from "../src/lib/payload/getPayload";

function text(value: string) {
  return { type: "text" as const, detail: 0, format: 0, mode: "normal" as const, style: "", text: value, version: 1 as const };
}

function paragraph(value: string) {
  return { type: "paragraph" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] };
}

function heading(value: string) {
  return { type: "heading" as const, tag: "h2" as const, format: "", indent: 0, version: 1, direction: "ltr" as const, children: [text(value)] };
}

function list(items: string[]) {
  return {
    type: "list" as const,
    listType: "bullet" as const,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    start: 1,
    tag: "ul" as const,
    children: items.map((item) => ({
      type: "listitem" as const,
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      value: 1,
      children: [paragraph(item)],
    })),
  };
}

const content = {
  root: {
    type: "root" as const,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: [
      paragraph("Давление нужно проверять относительно фактической нагрузки, конфигурации оси и спецификации конкретной шины. Одной универсальной цифры для любого размера и режима эксплуатации нет."),
      heading("Пример характеристики BIZON 315/80R22.5"),
      paragraph("Для размера 315/80R22.5 в технической таблице BIZON указаны: 20 PR, стандартный обод 9.00 дюйма, давление 850 кПа для одиночной и сдвоенной установки, максимальная нагрузка 4000 lb для одиночной и 3350 lb для сдвоенной установки, индексы нагрузки 156/150, индекс скорости L, наружный диаметр 1076 мм и ширина профиля 312 мм."),
      paragraph("Эти значения относятся к конкретной строке размера и не переносятся автоматически на другие модели, рисунки протектора или режимы эксплуатации."),
      heading("Что проверить до выезда"),
      list(["Состояние шины и вентиля перед измерением.", "Положение шины на автомобиле и фактическую нагрузку на ось.", "Показание на холодной шине и источник нормы, по которому оно сравнивается.", "Отклонения по сдвоенным колёсам и повторяющиеся потери давления."]),
      heading("Когда нужна проверка специалиста"),
      paragraph("При заметной разнице между шинами одной оси, повреждении боковины, повторной потере давления или сомнении в допустимой нагрузке эксплуатацию нужно остановить до профессиональной проверки."),
    ],
  },
};

const payload = await getPayload();
const existing = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: "cold-inflation-pressure-check" } }, limit: 1, depth: 0 });
if (!existing.docs[0]) throw new Error("Published Tire IQ article was not found");

await payload.update({
  collection: "tire-iq-articles",
  id: existing.docs[0].id,
  data: { content, status: existing.docs[0].status, publishedAt: existing.docs[0].publishedAt },
} as Parameters<Payload["update"]>[0]);

console.log("Updated BIZON specifications in cold-inflation-pressure-check.");

const markingContent = {
  root: {
    type: "root" as const,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: [
      paragraph("Маркировка помогает описать размер, конструкцию, посадочный диаметр, индексы нагрузки и символ скорости. Для окончательного подбора её всегда нужно сверять со спецификацией автомобиля и производителя шины."),
      heading("Пример BIZON 315/80R22.5 156/150 L"),
      list(["315 — номинальная ширина профиля 315 мм.", "80 — отношение высоты профиля к ширине.", "R — радиальная конструкция.", "22.5 — посадочный диаметр обода.", "156/150 — индексы нагрузки для одиночной и сдвоенной установки.", "L — индекс скорости."]),
      paragraph("Для этой строки каталога BIZON также указаны 20 PR, стандартный обод 9.00 дюйма, давление 850 кПа, максимальная нагрузка 4000/3350 lb single/dual, наружный диаметр 1076 мм и ширина профиля 312 мм."),
      heading("Что маркировка не заменяет"),
      paragraph("Обозначение на боковине не подтверждает совместимость со всеми осями и режимами. Нужно дополнительно проверить требования техники, фактическую нагрузку, конфигурацию колёс и официальную документацию конкретной модели."),
    ],
  },
};

const markingArticle = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: "how-to-read-tire-size-marking" } }, limit: 1, depth: 0 });
if (!markingArticle.docs[0]) throw new Error("Published Tire IQ marking article was not found");
await payload.update({
  collection: "tire-iq-articles",
  id: markingArticle.docs[0].id,
  data: { content: markingContent, status: markingArticle.docs[0].status, publishedAt: markingArticle.docs[0].publishedAt },
} as Parameters<Payload["update"]>[0]);
console.log("Updated BIZON specifications in how-to-read-tire-size-marking.");

const loadContent = {
  root: {
    type: "root" as const,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: [
      paragraph("Требуемое холодное давление определяется не только размером шины. В расчёт входят фактическая нагрузка, конфигурация оси, спецификация шины и условия эксплуатации."),
      heading("Пример BIZON 315/80R22.5"),
      paragraph("Для конкретной строки BIZON 315/80R22.5 указаны давление 850 кПа, максимальная нагрузка 4000 lb при одиночной установке и 3350 lb при сдвоенной, а также индексы нагрузки 156/150. Эти значения нельзя переносить на другую модель или размер без проверки таблицы."),
      heading("Связь параметров"),
      paragraph("Фактическая нагрузка + конфигурация колёс + спецификация шины → требуемое холодное давление. Если один из элементов изменился, прежняя настройка требует повторной проверки."),
      heading("Практический порядок"),
      list(["Зафиксируйте нагрузку по осям и режим маршрута.", "Проверьте, какая спецификация BIZON установлена на каждой оси.", "Сверьте требование с таблицей для конкретного размера и модели.", "Измерьте давление на холодной шине и сохраните результат в журнале."]),
      heading("Ограничение"),
      paragraph("Эта статья объясняет методику, но не задаёт норму давления для всех шин BIZON. Для численного решения нужны размер, модель, конфигурация и фактическая нагрузка."),
    ],
  },
};

const loadArticle = await payload.find({ collection: "tire-iq-articles", where: { slug: { equals: "load-and-inflation-engineering-relationship" } }, limit: 1, depth: 0 });
if (!loadArticle.docs[0]) throw new Error("Published Tire IQ load article was not found");
await payload.update({
  collection: "tire-iq-articles",
  id: loadArticle.docs[0].id,
  data: { content: loadContent, status: loadArticle.docs[0].status, publishedAt: loadArticle.docs[0].publishedAt },
} as Parameters<Payload["update"]>[0]);
console.log("Updated BIZON specifications in load-and-inflation-engineering-relationship.");

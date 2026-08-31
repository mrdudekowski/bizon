const r = await fetch("http://localhost:3000/");
const t = await r.text();
console.log({
  status: r.status,
  allModels: t.includes("Все модели"),
  assortmentCard: t.includes("assortmentCard") || /Смотреть модель/.test(t),
});

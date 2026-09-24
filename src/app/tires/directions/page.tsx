import { readPublishedTireDirections } from "@/admin/system/databaseLink";

export default async function TireDirectionsPage() {
  const directions = await readPublishedTireDirections(process.env.BACKEND_URL);

  return (
    <main>
      <h1>Направления шин</h1>
      {directions === null ? (
        <p>Список появится, когда backend-app ответит из базы bizon.</p>
      ) : directions.length === 0 ? (
        <p>В опубликованном снимке нет направлений.</p>
      ) : (
        <ul>
          {directions.map((direction) => (
            <li key={direction.id}>
              {direction.name} · {direction.slug} · на сайте
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
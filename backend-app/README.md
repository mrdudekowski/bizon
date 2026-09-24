# backend-app

Единственный процесс, который открывает Postgres. `frontend-cms` и `main-app` ходят сюда по HTTP и не держат свой `DATABASE_URL`.

Локальная база — Postgres 16 в Docker, порт хоста `5433`, база `bizon`. API слушает `4000`.

## Запуск

Из корня ветки `main-app`:

```bash
sudo docker compose up -d --build
cd backend-app
npm ci
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/bizon npm run sync
```

`npm run sync` применяет миграции и проверяет, что запись и чтение сходятся с контрактом обоих приложений: health, roundtrip, опубликованное направление `long-haul`, страница `home`.

Контракт страниц совпадает с `src/lib/content/pages/keys.ts` на `main-app`.

## Timeweb

`npm run migrate:timeweb` не стартует, пока локальный sync не прошёл и не заданы `CONFIRM_FLAWLESS=yes` и `TIMEWEB_DATABASE_URL`.

Панель Timeweb дополнительно требует: исходная база доступна из `92.53.116.0/24`, у приёмника есть публичный IPv4, и в кластере ещё нет базы с тем же именем, если импорт идёт кнопкой «Импортировать». Скрипт переносит дамп через `pg_dump` / `pg_restore`, а не через эту кнопку.

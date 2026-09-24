# BIZON frontend-cms

Админка. Публичный сайт живёт на `main-app`. Базу открывает только `backend-app` в том дереве: Postgres 16 в Docker, база `bizon`.

`BACKEND_URL` указывает на этот API. Без него шапка пишет «База не настроена». Когда API и схема `001_documents` на месте, шапка пишет «База подключена», а `/tires/directions` показывает опубликованные направления из той же базы, что читает `main-app`.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Синхронизация схемы и проверка записи/чтения: `npm run sync` в `backend-app` на ветке `main-app`. Перенос в Timeweb этим приложением не запускается.

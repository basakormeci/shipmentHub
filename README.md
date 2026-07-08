# Shipment Hub

React + Vite SPA (Shipment Hub.00). Monolit referans: `archive/shipment-hub.html`.

## Geliştirme

```bash
npm install
npm run dev
```

Demo giriş: `basak@omnitive.com` / `basakharikadir`

## Build & lokal prod

```bash
npm run build
npm start
```

`npm start` → `serve -s dist` (SPA fallback). Port: `PORT` env veya `3000`.

Smoke (lokal prod):

```bash
npm run build && npm start
# / → 200, /shipments/1 hard refresh → detay, /unknown-route → 404 UI (girişliyken)
# Çıkış + /shipments → /login redirect
```

## Railway

`railway.toml` ile:

- build: `npm ci && npm run build`
- start: `npm start` (`serve -s dist -l $PORT`)
- healthcheck: `/`

Deep link hard refresh için `serve -s` SPA fallback zorunlu (Railway `index.html` 404 dönmemeli).

Persist anahtarları (Zustand): `shipment-hub:auth` (session) · `shipment-hub:ui` (session) · `shipment-hub:v1` (local). Ayrıntı: `src/stores/persist.ts`.

## Proje planı

Ayrıntılı fazlar: [Shipment-Hub.00.md](./Shipment-Hub.00.md)

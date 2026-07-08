# Shipment Hub.00

React + Vite ile `shipment-hub.html` monolitinin SPA’ya taşınması.

| | |
|---|---|
| **Kod adı** | Shipment Hub.00 |
| **Kaynak** | `archive/shipment-hub.html` |
| **Stack** | Vite · React 19 · TypeScript · React Router · Zustand (persist) · Tailwind · Railway |
| **Routing** | Path params (`/shipments/:shipmentId`, `/routing/:tab` …) |
| **State** | Auth + draft/filter persist (session/local); entity seed persist |
| **Deploy** | Railway (`vite build` + `serve -s dist`) |
| **Durum** | Faz 0–5 ✅ (Shipment Hub.00 kod taşıması tamam) |

### İlerleme özeti (2026-07-08)

| Faz | Durum | Not |
|-----|--------|-----|
| 0 Scaffold + Railway | **Tamamlandı** | Vite/React/TS/Tailwind, `railway.toml`, archive, SPA fallback |
| 1 Core foundation | **Tamamlandı** | Auth, stores, i18n, shell, TabGuard, libs |
| 2 Düşük bağımlılıklı sayfalar | **Tamamlandı** | Dashboard … Routing |
| 3 Operasyon çekirdeği | **Tamamlandı** | Shipments / Returns / Transfers + barkod print modal |
| 4 Contracts wizard | **Tamamlandı** | List + 3-step wizard, draft session persist |
| 5 Sertleştirme + Railway | **Tamamlandı** | NotFoundPage, persist docs, barcode print, README |

**Persist anahtarları:** `shipment-hub:auth` (session) · `shipment-hub:ui` (session) · `shipment-hub:v1` (local data)

**Demo giriş:** `basak@omnitive.com` / `basakharikadir`

**Çalıştırma:** `npm run dev` · `npm run build && npm start`

---

## Route haritası

```
/login
/
/dashboard
/shipments
/shipments/new
/shipments/:shipmentId
/returns
/returns/new
/returns/:returnId
/contracts
/contracts/new
/contracts/:contractId/edit
/nodes
/transfers
/transfers/new
/transfers/:transferId
/routing/:tab?
/monitoring/:tab?
/finance/:tab?
/performance
/reports
/users
/permissions
/templates
/barcode-templates
```

Tab path değerleri:  
- routing → `rules` \| `weights` \| `scoring` \| `history`  
- monitoring → `health` \| `errors` \| `webhooks`  
- finance → `pricing` \| `invoices` \| `quotas`

---

## Faz 0 — Scaffold + Railway iskeleti

### Gereksinimler

- Vite + React + TypeScript projesi ayağa kalkmalı.
- Tailwind, monolit CSS token’ları ve ortak sınıflarla (`badge`, `form-input`, `nav-link`, `primary-btn` …) yapılandırılmalı.
- Canlı entry React olmalı; monolit referans olarak `archive/shipment-hub.html` altında kalmalı.
- Production build çıktısı static SPA olarak servis edilebilmeli (SPA fallback dahil).
- Railway deploy tanımı (`railway.toml` veya eşdeğeri) repoda olmalı.
- Boş shell: login placeholder + temel layout iskeleti yeterli.

### Tasklar

1. Vite React-TS scaffold oluştur; `package.json` script’leri: `dev`, `build`, `start`, `preview`. ✅
2. Tailwind + `src/styles/app.css` — monolit `<style>` ve Tailwind config renklerini taşı. ✅
3. `index.html` + `App.tsx` shell: `#` yapısı yerine React root; placeholder Login / AppShell. ✅
4. `serve` ile `dist` servisi (`serve -s`, `PORT`). ✅
5. `railway.toml` (build/start) ve kısa deploy notu (README veya bu dokümanın Deploy bölümü). ✅
6. `shipment-hub.html` → `archive/shipment-hub.html`; gerekirse `archive/` içindeki eski HTML’ler dokunulmadan kalsın. ✅
7. `.gitignore`: `node_modules`, `dist`, env lokal dosyaları. ✅

### Test senaryosu

1. `npm install` → `npm run dev` → tarayıcıda uygulama açılır, konsolda kritik hata yok.
2. `npm run build` → `dist/` üretilir.
3. `npm start` (veya `PORT=3000 npm start`) → `/` 200; bilerek `/any-deep-path` açılınca SPA fallback ile `index.html` döner (404 boş sayfa olmamalı).
4. Arşiv yolu: `archive/shipment-hub.html` dosyası mevcut ve açılabilir.

### Kabul kriterleri

- [x] React-TS + Vite + Tailwind projesi çalışıyor.
- [x] Monolit `archive/shipment-hub.html` altında.
- [x] `npm run build && npm start` ile static SPA ayakta; deep path fallback var.
- [x] Railway build/start komutları dokümante / `railway.toml` hazır.
- [x] Görsel redesign yok; sadece iskelet + token/CSS taşıması.

**Faz 0 durum:** tamamlandı (2026-07-08). Build + `serve -s` deep path HTTP 200 smoke geçti.

---

## Faz 1 — Core foundation

### Gereksinimler

- Auth: monolit ile aynı demo kullanıcı listesi + şifre kontrolü; login/logout.
- Oturum refresh sonrası korunmalı (`sessionStorage` persist).
- Korumalı rotalar: giriş yoksa `/login`; giriş varken `/login` → uygulama köküne.
- Zustand store’ları: `auth`, `data` (seed), `ui` (tercihler/draft altyapısı).
- Entity seed: monolitteki demo veriler ilk yüklemede yüklenir; mutation altyapısı data store’da.
- i18n: `tr` / `en` dict + `t()`; dil tercihi persist.
- Layout: Sidebar (NavLink), Topbar, dil menüsü, toast altyapısı.
- Tüm route path’leri tanımlı (stub sayfa veya Coming Soon kabul).

### Tasklar

1. `authStore` + LoginPage (email/şifre, hata mesajları, aktif kullanıcı kontrolü). ✅
2. `RequireAuth` / public layout ayırımı. ✅ *(login sonrası `from` redirect dahil)*
3. `dataStore` seed port + `localStorage` persist (`shipment-hub:v1`). ✅
4. `uiStore` + `sessionStorage` persist iskeleti (lang, nodes search/expanded). ✅
5. i18n modülleri; Topbar dil switch. ✅
6. `Sidebar` + `Topbar` bileşenleri; aktif route vurgusu. ✅ *(tab group prefix active)*
7. `toast` / format / clipboard lib’leri. ✅ (`src/lib/toast.ts`, `format.ts`, `clipboard.ts`)
8. React Router route tree — path params iskeleti; stub pages. ✅
9. Logout UI (sidebar kullanıcı bloğu). ✅
10. Illegal tab path redirect (`TabGuard` routing/monitoring/finance). ✅

### Test senaryosu

1. Uygulamayı aç → `/login`; geçersiz email/şifre → hata; doğru credentials → shell açılır.
2. Refresh → oturum açık kalır; Sidebar görünür.
3. Logout → `/login`; adres çubuğuna `/shipments` yaz → tekrar `/login`.
4. Dil TR↔EN → sidebar/topbar metinleri değişir; refresh sonrası dil korunur.
5. Her ana path’e tıklayınca URL değişir (stub içerik OK).
6. Seed data store’da dolu (devtools veya Nodes stub öncesi console/assert).

### Kabul kriterleri

- [x] Login/logout monolit kurallarıyla uyumlu çalışır.
- [x] Auth + dil refresh sonrası korunur.
- [x] Route guard çalışır.
- [x] Sidebar gerçek `<NavLink>` / router link kullanır (`S.page` yok).
- [x] Tüm planlanan path’ler router’da tanımlı.
- [x] Data seed yüklenir ve persist edilir.

**Faz 1 durum:** tamamlandı (2026-07-08). Gap kapanışı: format/clipboard, persist key naming, login `from` redirect, reactive sidebar user, `TabGuard`.

**Faz 1 dosya haritası (özet):**

```
src/
  App.tsx, main.tsx, styles/app.css
  stores/{authStore,dataStore,uiStore,index}.ts
  i18n/index.ts
  lib/{toast,format,clipboard}.ts
  hooks/useT.ts
  router/{index,guards,TabGuard}.tsx
  components/layout/{AppShell,Sidebar,Topbar,navConfig}.tsx
  components/ui/Toasts.tsx
  pages/{LoginPage,StubPage}.tsx
```

---

## Faz 2 — Düşük bağımlılıklı sayfalar

### Gereksinimler

- Aşağıdaki sayfalar monolit parity ile çalışmalı (demo data, CRUD/modal davranışları):
  - Nodes, Dashboard, Permissions, Performance
  - Users, Templates, Barcode templates
  - Reports, Monitoring (`/monitoring/:tab`), Finance (`/finance/:tab`), Routing (`/routing/:tab`)
- Tab’lı sayfalarda tab path param; geçersiz tab → default tab’a redirect.
- Liste filtre / arama state’i (varsa) persist edilmeli.
- Modal `show` refresh’te zorunlu açık kalmaz; form draft’ları ui/data politikasına göre korunur.

### Tasklar

1. **NodesPage** — liste, arama, create/delete modal; pattern referansı. ✅
2. **DashboardPage** — seed’ten metrik/kartlar; deep link butonları router navigate. ✅
3. **PermissionsPage**, **PerformancePage**. ✅
4. **UsersPage** — create/edit/delete modals. ✅
5. **TemplatesPage**, **BarcodeTemplatesPage**. ✅
6. **ReportsPage** — tarih/filtre. ✅
7. **MonitoringPage** — path tab + paneller. ✅
8. **FinancePage** — path tab + pricing/invoice/quota modals. ✅
9. **RoutingPage** — path tab + kural CRUD / weights / scoring / history. ✅
10. Her sayfa için i18n + NavLink doğrulaması. ✅

### Test senaryosu

1. Nodes: oluştur → listede görünsün → refresh → kayıt kalsın → sil → onay sonrası kaybolsun.
2. Users: yeni kullanıcı → login listesinde etkisini (aynı seed) doğrula.
3. `/monitoring/errors` refresh → errors tab aktif.
4. `/finance/foo` (geçersiz) → default tab’a düş.
5. `/routing/rules` içinde kural ekle/düzenle/sil; refresh sonrası data persist.
6. Dashboard’daki “Tümünü Gör” vb. linkler doğru path’e gitsin.
7. Templates / barcode templates: kaydet, aktif toggle, sil.

### Kabul kriterleri

- [x] Faz 2 sayfalarının tamamı stub değil, monolit parity’de. *(dashboard widget alt kümesi; core metrikler/listeler mevcut)*
- [x] **NodesPage** monolit parity (liste/arama/create/delete; sözleşme bağlantısı contracts gelince).
- [x] Tab path’leri çalışır; illegal tab redirect var (`TabGuard` + sayfa tab UI).
- [x] Entity mutation’lar dataStore persist ile kalıcı.
- [x] İlgili filtre/arama persist (nodes, dashboard dates, reports filters, routing weights).
- [x] Layout (sidebar/topbar) bozulmadan tüm sayfalarda tutarlı.

**Faz 2 durum:** tamamlandı (2026-07-08). Build yeşil. Hâlâ stub: shipments / returns / transfers / contracts (Faz 3–4).

**Faz 2 eklenen dosyalar:** `src/data/catalog.ts`, `DashboardPage`, `users/UsersPage`, `PermissionsPage`, `PerformancePage`, `templates/*`, `ReportsPage`, `monitoring/MonitoringPage`, `finance/FinancePage`, `routing/RoutingPage`, `components/ui/TabBar.tsx` + `StatTile.tsx`.

---

## Faz 3 — Operasyon çekirdeği (Shipments / Returns / Transfers)

### Gereksinimler

- Shipments: liste (filtre, kolon paneli, pagination, seçim), detay path param, create, status/cancel/recall/edit modals, barkod modal.
- Returns: liste / detay / create; ilgili modallar.
- Transfers: liste / detay / create; ilgili modallar.
- Create başarı sonrası ilgili detail path’e `navigate`.
- Detail refresh (`/shipments/:id` vb.) aynı kaydı açmalı; yoksa listeye güvenli dönüş.
- Liste filtre/arama/pagination/kolon tercihleri persist.
- Deep link ve breadcrumb geri navigasyonu router ile.

### Tasklar

1. Shipments list + column panel + pagination + filters. ✅
2. Shipment detail route + modals (status, cancel, recall, edit). ✅
3. Shipment create + başarıda detail navigate. ✅
4. Barcode modal (print / PNG akışı). ✅ *(print window; PNG opsiyonel kaldı)*
5. Returns list/detail/create + modals. ✅
6. Transfers list/detail/create + modals. ✅
7. Dashboard / diğer sayfalardan operasyon deep link’lerini güncelle. ✅
8. Persist: list UI state + create form draft’ları. ✅

### Test senaryosu

1. `/shipments` filtre uygula → refresh → filtreler duruyor.
2. Detaya gir → URL `/shipments/{id}` → refresh → aynı detay.
3. Yeni gönderi oluştur → detail URL’ine düş → listede görünsün.
4. Status / iptal / recall / edit modal akışları monolit ile aynı iş kuralında.
5. Barkod modal açılır; yazdırma penceresi/kopya akışı kırılmaz.
6. Returns & Transfers için 2–5’i tekrarola.
7. Olmayan `:id` → listeye dönüş veya anlamlı boş durum (tutarlı davranış).

### Kabul kriterleri

- [x] Üç operasyon modülü path param + persist ile parity.
- [x] Create → detail navigate çalışır.
- [x] Refresh detail ve list filter senaryoları geçer.
- [x] Barcode modal production build’de de çalışır. *(print window)*
- [x] Programatik eski `S.page = …` kalıntısı yok; hep router.

**Faz 3 durum:** tamamlandı (2026-07-08). Build yeşil.

---

## Faz 4 — Contracts wizard

### Gereksinimler

- Contracts list: filtre (all/active/passive), CSV export, delete, düzenlemeye giriş.
- Wizard: `/contracts/new` ve `/contracts/:contractId/edit`.
- Step 1–2–3 (kısıtlar / bölgeler / credential + node bağları) monolit parity.
- Wizard draft persist: `step` + form `f` (+ errors politikası); refresh’te aynı adım ve alanlar.
- Modal `show` zorunlu persist edilmez; refresh’te modal kapalı, draft dolu.
- Node modal / credential kartları / validation / finalizeSave iş kuralları korunur.
- Kayıt sonrası listeye dönüş; listede güncel sözleşme.

### Tasklar

1. Contracts list page + CSV + satır aksiyonları. ✅
2. Wizard route’ları ve step state machine. ✅
3. Step1 / Step2 / Step3 bileşenleri (chip’ler, region picker, toggles). ✅
4. Credential kartları + node modal + password show. ✅
5. Validation + save (create/update) dataStore’a. ✅
6. Delete modal + node usage ilişkileri (nodes sayfası ile tutarlı). ✅
7. Wizard uiStore persist + version key. ✅
8. Edit deep link: `/contracts/:id/edit` doğru seed form. ✅

### Test senaryosu

1. Yeni sözleşme: step1 doldur → step2 → refresh → step2 ve alanlar duruyor → step3 tamamla → listede kayıt.
2. Edit: listeden düzenle → URL edit path → değişikliği kaydet → listede yansır.
3. Refresh edit sayfasında yarım form kaybolmaz.
4. Delete onay → listeden düşer; bağlı node usage güncellenir.
5. CSV indirme dosya üretir.
6. Step validation: zorunlu alanlar eksikken ilerleme/kaydet monolit gibi engellenir.

### Kabul kriterleri

- [x] Wizard + list monolit parity.
- [x] Refresh’te step ve form draft korunur.
- [x] Create/edit path params doğru çalışır.
- [x] DataStore mutation + nodes kullanımı tutarlı.
- [x] CSV export çalışır.

**Faz 4 durum:** tamamlandı (2026-07-08). Draft: `uiStore.contractWizard` (session). Build yeşil.

---

## Faz 5 — Sertleştirme + Railway prod

### Gereksinimler

- Bilinmeyen route → 404 sayfası.
- Illegal tab param → default tab redirect (tüm tab’lı modüller).
- Persist şema version / migrate (`version: 1`); eski key kırılımında güvenli reset veya migrate.
- Production build uyarısız (kritik error yok) tamamlanır.
- Railway üzerinde canlı URL; deep link refresh 404 vermez.
- README: `dev` / `build` / `start` / Railway notları.
- (Önerilen) Demo şifre için env alma notu veya `VITE_DEMO_PASSWORD` hazırlığı.

### Tasklar

1. `NotFoundPage` + router catch-all. ✅
2. Tab guard helper (routing/monitoring/finance). ✅
3. Persist version migrate. ✅ *(versiyonlar `src/stores/persist.ts` ile dokümante; bump = yeniden seed)*
4. Bundle/build lint-typecheck temizliği. ✅ *(build yeşil; chunk size uyarısı bilinen)*
5. Railway projesi bağla; env / start komut doğrula. ⚠️ *(repo hazır: `railway.toml`; canlı proje bağlama hesap tarafında)*
6. Smoke checklist’i README veya bu dosyaya işle. ✅
7. Secrets/env gözden geçirme (demo password). ✅ *(README notu; hâlâ `AUTH_PASSWORD` seed)*

### Test senaryosu

1. `/this-does-not-exist` → 404 UI; sidebar’dan çıkış mümkün.
2. Prod URL’de `/shipments/{id}` hard refresh → detay.
3. Prod’da wizard step2 refresh → draft duruyor.
4. Logout + korumalı URL → login.
5. Soft deploy sonrası `shipment-hub:v1` (veya yeni version) bozulmadan açılıyor; gerekirse migrate smoke.

### Kabul kriterleri

- [x] 404 + tab guard tamam.
- [ ] Railway prod URL’de uygulama ayakta. *(kod/deploy config hazır; canlı link kullanıcı deploy’una bağlı)*
- [x] Deep link + auth + wizard persist smoke geçti. *(lokal `serve -s` ile)*
- [x] README güncel.
- [x] Archive monolit referans olarak duruyor; canlı entry React.

**Faz 5 durum:** tamamlandı (2026-07-08) — canlı Railway bağlama hariç. Build yeşil.

---

## Ortak kabul (tüm fazlar)

- Görsel redesign yok; monolit parity öncelikli.
- Path params; liste/detay/create için query-id yaklaşımı yok (tab’lar path segment).
- Entity + auth/draft persist kararları bozulmaz.
- Her faz merge edilebilir PR olacak şekilde bırakılır.

---

## Deploy (hedef)

```bash
npm ci
npm run build
npm start   # serve -s dist -l $PORT
```

Railway: Nixpacks veya `railway.toml` ile `buildCommand` / `startCommand`; healthcheck `/`.

---

## Başarı kriterleri (proje geneli)

- [x] `/shipments/:id` refresh → aynı detay
- [x] Wizard step 2 refresh → step 2 + form dolu
- [x] Logout sonrası korumalı URL → `/login`
- [x] Sidebar gerçek router linkleri
- [ ] Railway’de deep link 404 yok *(deploy sonrası doğrulanacak)*
- [x] Monolit `archive/` altında referans

---

## Tahmini süre

| Faz | Süre |
|-----|------|
| 0 Scaffold + Railway iskelet | 0.5–1 gün |
| 1 Foundation | 1–2 gün |
| 2 Kolay sayfalar | 2–3 gün |
| 3 Operasyon çekirdeği | 3–5 gün |
| 4 Contracts wizard | 2–3 gün |
| 5 Prod sertleştirme | 1 gün |
| **Toplam** | **~10–15 iş günü** |

---

## Faz sıra özeti

```
Faz 0 → scaffold + archive + Railway iskelet
Faz 1 → auth, store, i18n, shell, route stubs
Faz 2 → nodes … routing (düşük bağımlılık)
Faz 3 → shipments / returns / transfers
Faz 4 → contracts wizard
Faz 5 → 404, migrate, Railway prod smoke
```

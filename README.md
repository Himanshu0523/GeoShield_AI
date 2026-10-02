# GeoShield AI

Two separate frontends, two different users:
- **Web Dashboard** → District administrators, disaster management authorities, control-room staff (desktop, good network)
- **Mobile App (PWA)** → Field officers + citizens (phone, patchy/offline network)

Each page below lists: **what's shown → why it exists → which backend API it calls.**

---

## PART A — Web Dashboard (Admin/Authority side)

### A1. Login Page
- **Shows:** Email/username + password (or SSO), "Select district/tenant" dropdown after login.
- **Why:** Multi-tenant system — a district officer should only land in their own jurisdiction's data.
- **API:** `POST /api-gateway/auth/login` → JWT issued by `api-gateway`.

### A2. Main GIS Dashboard (home page after login)
- **Shows:** Full NER map (MapLibre GL JS) with a **color-coded risk heatmap layer** (green/yellow/orange/red per village/grid-cell), toggleable layers for roads, villages, rainfall overlay, satellite imagery. Live-updating via WebSocket — no refresh needed.
- **Why:** This is the PS's #1 ask — "Real-time GIS dashboard and risk heatmaps." It's the landing page because it's the single most important view during an active event.
- **API:** `GET /spatial-service/regions/geojson` (initial load) + WebSocket `wss://stream-service/live` (real-time updates).

### A3. Region / Village Detail Panel (slide-out or modal from map)
- **Shows:** Click any village/polygon on the map → panel opens with: current risk score, rainfall (last 24h/7d), soil moisture trend chart, slope angle, last satellite pass date, nearby field reports (photos), historical landslide events in this area.
- **Why:** A red dot on a map isn't actionable alone — officials need the *evidence* behind the score to decide whether to evacuate.
- **API:** `GET /spatial-service/regions/{id}/detail`, `GET /risk-engine-service/regions/{id}/history`.

### A4. Road Connectivity Status Page
- **Shows:** List/map view of major roads with status: Open / At Risk / Blocked, plus which villages become isolated if a given road is blocked (computed via OSRM routing).
- **Why:** Explicit PS dashboard requirement — "Road connectivity status."
- **API:** `GET /spatial-service/roads/status`, internally calls self-hosted OSRM for isolation analysis.

### A5. Weather-Linked Risk Forecast Page
- **Shows:** 5–7 day rainfall forecast (IMD + Open-Meteo) overlaid with predicted risk trend per district — a simple line/area chart: "risk expected to rise Thursday–Friday as rain intensifies."
- **Why:** Explicit PS requirement — helps authorities plan *ahead* of the event, not just react to current risk.
- **API:** `GET /ingestion-service/forecast/{district}`, `GET /risk-engine-service/forecast/{district}`.

### A6. Emergency Response Prioritization Page
- **Shows:** Auto-ranked list of villages/zones sorted by (risk score × population/infrastructure exposure), each with quick actions: "Dispatch alert," "Mark evacuated," "Assign field officer."
- **Why:** Explicit PS dashboard requirement — turns raw risk scores into an actionable to-do list for limited disaster-response resources.
- **API:** `GET /risk-engine-service/priority-list`, `POST /alert-service/dispatch`.

### A7. Alerts & Notification Center
- **Shows:** Log of every alert sent — timestamp, region, channel (Telegram/ntfy/SMS), language, delivery status (sent/failed).
- **Why:** Accountability and audit trail — government systems need to prove an alert was actually sent before a disaster, not just that the model predicted risk.
- **API:** `GET /alert-service/history` (reads from Kafka `audit.log` topic, stored in Postgres).

### A8. Field Reports Review Page
- **Shows:** Grid of citizen/field-officer submitted photos/videos, each pinned on a mini-map, with status: Pending Review / Verified / Dismissed, and a button to feed a verified report into the risk model as a weight boost for that zone.
- **Why:** Explicit PS requirement — "allow citizens/field officials to upload geo-tagged photos/videos"; this is the review/moderation side of that pipeline.
- **API:** `GET /field-reports-service/reports?status=pending`, `POST /field-reports-service/reports/{id}/verify`.

### A9. Historical Trends & Analytics Page
- **Shows:** Charts over time — landslide events per season, model accuracy over past predictions vs actual outcomes, rainfall-vs-risk correlation.
- **Why:** Builds trust in the AI model for government adoption, and helps improve the model (retraining insight) over subsequent seasons.
- **API:** `GET /risk-engine-service/analytics`.

### A10. Admin / Settings Page
- **Shows:** Manage users/roles per district (tenant), API key management, notification channel config (Telegram bot token, ntfy topic), language preferences per region.
- **Why:** Every multi-tenant government platform needs an admin surface — without it, onboarding a new district means editing code.
- **API:** `GET/POST /api-gateway/admin/*` (protected, admin-role only).

---

## PART B — Mobile App / PWA (Field Officer + Citizen side)

### B1. Onboarding / Language Selection
- **Shows:** First-launch screen — pick language (English, Hindi, Assamese, Bodo, Khasi, Garo, Mizo, Manipuri, Nepali...) via Bhashini-supported list. No login required for citizens (anonymous reporting allowed); field officers log in with credentials.
- **Why:** Explicit PS requirement — multilingual support, and low barrier to entry for citizen reporting (requiring login would kill adoption).
- **API:** `GET /alert-service/supported-languages` (Bhashini language list).

### B2. Home / Map Screen
- **Shows:** Simplified map centered on user's current location, showing nearby risk zones (color-coded), a banner if the user is currently in a high-risk area, and an "Offline Mode" indicator if no connectivity.
- **Why:** The core "am I safe right now" view for a villager or field officer standing in the hills.
- **API:** `GET /spatial-service/regions/nearby?lat=&lon=` — **cached locally** for offline viewing (last-synced version shown with a "last updated X hours ago" label).

### B3. Report Submission Screen
- **Shows:** Camera capture (photo/video) → auto-attaches GPS coordinates + timestamp → short form (crack/slope movement/blocked road/other) → optional text note → Submit button.
- **Why:** Direct implementation of the PS's citizen/field-reporting requirement — kept as simple as possible (camera + one tap) since users may be stressed or in a hurry.
- **API:** `POST /field-reports-service/reports` — **if offline, queued locally** (WatermelonDB/SQLite) and auto-submitted when connectivity returns.

### B4. My Reports / Sync Queue Screen
- **Shows:** List of the user's submitted reports with status: Queued (offline, waiting to sync) / Uploading / Submitted / Verified by authority.
- **Why:** Explicit offline-functionality requirement — users need visible confirmation their report wasn't lost, even without signal.
- **API:** Local device DB read; syncs to `POST /field-reports-service/reports` in background when online.

### B5. Alerts / Notifications Feed
- **Shows:** Push notifications received (via ntfy/Telegram/FCM) in the user's selected language, with severity icons, plus a persistent list so a user who was offline when an alert fired still sees it on next app open.
- **Why:** The actual "early warning" delivery point for the end citizen — this is the whole point of the platform.
- **API:** Subscribes to ntfy topic / Telegram bot; also `GET /alert-service/inbox?user_id=` for missed alerts on reconnect.

### B6. Profile / Settings Screen
- **Shows:** Change language, notification preferences, (for field officers) assigned district/zone, offline storage usage/clear cache option.
- **Why:** Standard app hygiene page — also where a field officer switches which district they're currently reporting for.
- **API:** `GET/POST /api-gateway/users/me`.

---

## Page-Build Priority Order (for demo/MVP)

1. **A2 Main GIS Dashboard** — the single most demo-worthy screen, build first
2. **B2 Home/Map + B3 Report Submission** — proves the offline citizen-reporting loop
3. **A4 Road Connectivity + A6 Response Prioritization** — proves you covered the PS's specific dashboard asks, not just a generic map
4. **A7 Alerts Center + B5 Alerts Feed** — proves the end-to-end warning loop works
5. **A8 Field Reports Review** — closes the human-verification loop
6. Everything else (A3, A5, A9, A10, B1, B4, B6) — polish once the core loop is demonstrable
# Tasks: Mängelmelder Musterhausen

**Input**: Design documents from `/specs/001-maengelmelder-platform/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/api.yml ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelisierbar (verschiedene Dateien, keine Abhängigkeiten untereinander)
- **[Story]**: Zugehörige User Story (US1–US5)

---

## Phase 1: Setup (Monorepo-Infrastruktur)

**Purpose**: Projekt-Initialisierung und grundlegende Monorepo-Struktur

- [ ] T001 Monorepo-Verzeichnisstruktur anlegen: `apps/frontend/`, `apps/backend/`, `packages/shared-types/`
- [ ] T002 Root `package.json` mit Turborepo + npm workspaces konfigurieren
- [ ] T003 [P] `packages/shared-types/` initialisieren: `package.json`, `tsconfig.json`, `src/index.ts`
- [ ] T004 [P] `apps/backend/` initialisieren: Express + TypeScript + Prisma Setup, `package.json`, `tsconfig.json`
- [ ] T005 [P] `apps/frontend/` initialisieren: Vite + React + TypeScript, `package.json`, `vite.config.ts`
- [ ] T006 [P] ESLint + Prettier für alle Packages konfigurieren (Root `eslint.config.js`, `.prettierrc`)
- [ ] T007 `docker-compose.yml` für lokale PostgreSQL-Datenbank erstellen
- [ ] T008 `.env.example` mit allen dokumentierten ENV-Variablen erstellen
- [ ] T009 [P] GitHub Actions CI-Workflow anlegen: `.github/workflows/ci.yml` (Lint + Tests)
- [ ] T010 Root `README.md` mit Setup-Anleitung erstellen
- [ ] T011 `turbo.json` mit Build-, Test- und Dev-Pipelines konfigurieren

---

## Phase 2: Foundational (Blockierende Voraussetzungen)

**Purpose**: Kern-Infrastruktur, die ALLE User Stories benötigen

**⚠️ KRITISCH**: Keine User-Story-Arbeit kann beginnen, bevor diese Phase abgeschlossen ist

- [ ] T012 Shared Types definieren: `packages/shared-types/src/report.types.ts` (Status-Enum, Priority-Enum, Report-Interface)
- [ ] T013 [P] Shared Types definieren: `packages/shared-types/src/category.types.ts`
- [ ] T014 [P] Shared Types definieren: `packages/shared-types/src/user.types.ts` (StaffUser, Citizen, Roles)
- [ ] T015 [P] Shared Types definieren: `packages/shared-types/src/api.types.ts` (Request/Response DTOs)
- [ ] T016 Prisma Schema erstellen: `apps/backend/src/prisma/schema.prisma` (alle Entities aus data-model.md)
- [ ] T017 Prisma-Migration ausführen und initialen Seed anlegen: `apps/backend/src/prisma/seed.ts` (9 Standardkategorien)
- [ ] T018 Express App-Grundgerüst aufbauen: `apps/backend/src/app.ts` (Middleware-Stack, CORS, Helmet, CSRF)
- [ ] T019 [P] JWT-Auth-Middleware implementieren: `apps/backend/src/api/middleware/auth.middleware.ts`
- [ ] T020 [P] Fehlerbehandlung und Logging einrichten: `apps/backend/src/lib/logger.ts` (Winston/Pino), `apps/backend/src/api/middleware/error.middleware.ts`
- [ ] T021 [P] Multer Upload-Middleware konfigurieren: `apps/backend/src/api/middleware/upload.middleware.ts`
- [ ] T022 [P] Input-Validierung mit zod einrichten: `apps/backend/src/api/middleware/validate.middleware.ts`
- [ ] T023 Tailwind CSS + shadcn/ui im Frontend einrichten: `apps/frontend/tailwind.config.ts`, shadcn init
- [ ] T024 [P] i18n einrichten: `apps/frontend/src/i18n/` mit react-i18next, deutsche Basis-Übersetzungen `de.json`
- [ ] T025 [P] API-Client-Basis im Frontend: `apps/frontend/src/services/api.client.ts` (Axios/Fetch mit Base-URL, Auth-Header)
- [ ] T026 [P] TanStack Query im Frontend einrichten: `apps/frontend/src/lib/query.ts`
- [ ] T027 AppConfig-Service im Backend: `apps/backend/src/services/config.service.ts` (Lesen/Schreiben AppConfig-Tabelle)

**Checkpoint**: Foundation bereit – User Stories können implementiert werden

---

## Phase 3: User Story 1 – Anonyme Meldung einreichen (Priority: P1) 🎯 MVP

**Goal**: Bürger können ohne Registrierung Mängel melden und erhalten eine Ticket-ID

**Independent Test**: Formular aufrufen → Kategorie wählen → Standort setzen → Absenden → Ticket-ID sehen → Meldung in DB vorhanden

### Backend

- [ ] T028 [P] [US1] Report-Controller implementieren: `apps/backend/src/api/controllers/report.controller.ts` (POST /api/v1/reports)
- [ ] T029 [P] [US1] Report-Service implementieren: `apps/backend/src/services/report.service.ts` (createReport, generatePublicToken, Duplikatprüfung)
- [ ] T030 [US1] Upload-Service implementieren: `apps/backend/src/services/upload.service.ts` (Foto-Speicherung, max. 3, Validierung)
- [ ] T031 [US1] Report-Router registrieren: `apps/backend/src/api/routes/reports.routes.ts` (POST /reports, GET /reports/:id, GET /reports/track/:token, GET /reports/nearby)
- [ ] T032 [US1] Duplikat-Erkennung implementieren: Haversine-Query in PostgreSQL (100m Radius + gleiche Kategorie + Status != RESOLVED)

### Frontend

- [ ] T033 [P] [US1] Leaflet-Kartenkomponente erstellen: `apps/frontend/src/components/map/ReportMap.tsx` (Klick auf Karte = Standort setzen, GPS-Button)
- [ ] T034 [P] [US1] Kategorie-Auswahl-Komponente: `apps/frontend/src/components/report/CategoryPicker.tsx` (Icons, Grid-Layout, mobil-optimiert)
- [ ] T035 [US1] Meldeformular-Wizard implementieren (4 Schritte): `apps/frontend/src/components/report/ReportWizard.tsx`
  - Schritt 1: Kategorie wählen (T034)
  - Schritt 2: Standort auf Karte (T033) oder Adresseingabe
  - Schritt 3: Beschreibung + Foto-Upload
  - Schritt 4: Zusammenfassung + Absenden
- [ ] T036 [US1] Foto-Upload-Komponente: `apps/frontend/src/components/report/PhotoUpload.tsx` (max. 3, Preview, Drag & Drop)
- [ ] T037 [US1] Bestätigungsseite: `apps/frontend/src/pages/public/ReportSuccess.tsx` (Ticket-ID prominent, Copy-Button, Statusverfolgungslink)
- [ ] T038 [US1] Duplikat-Hinweis-Komponente: `apps/frontend/src/components/report/DuplicateWarning.tsx`
- [ ] T039 [US1] Report-API-Service im Frontend: `apps/frontend/src/services/reports.service.ts` (submitReport, fetchNearby)
- [ ] T040 [US1] Seitenrouting einrichten: `apps/frontend/src/App.tsx` (React Router, öffentliche Routen)

**Checkpoint**: US1 vollständig – anonyme Meldung funktioniert End-to-End

---

## Phase 4: User Story 2 – Karte und Liste (Priority: P2)

**Goal**: Bürger können alle öffentlichen Meldungen auf Karte und in Liste einsehen

**Independent Test**: Übersichtsseite öffnen → Meldungen auf Karte sehen → Marker klicken → Detailansicht → Liste filtern

### Backend

- [ ] T041 [P] [US2] GET /api/v1/reports Endpunkt mit Filterparametern: `apps/backend/src/api/controllers/report.controller.ts` (Pagination, Kategorie, Status, Geo-Filter)
- [ ] T042 [P] [US2] GET /api/v1/reports/:id Detailansicht-Endpunkt implementieren
- [ ] T043 [P] [US2] GET /api/v1/categories Endpunkt: `apps/backend/src/api/controllers/category.controller.ts`
- [ ] T044 [US2] GET /api/v1/reports/track/:publicToken Statusverfolgungsendpunkt implementieren

### Frontend

- [ ] T045 [P] [US2] Übersichtskarte mit allen Meldungen: `apps/frontend/src/pages/public/ReportsMap.tsx` (Leaflet, Cluster-Plugin)
- [ ] T046 [P] [US2] Meldungs-Marker-Komponente: `apps/frontend/src/components/map/ReportMarker.tsx` (Kategorie-Icon, Farbe, Popup)
- [ ] T047 [P] [US2] Listenansicht mit Filterung: `apps/frontend/src/pages/public/ReportsList.tsx` (Kategorie, Status, Datum)
- [ ] T048 [US2] Detailansicht einer Meldung: `apps/frontend/src/pages/public/ReportDetail.tsx` (Karte, Fotos, Status-Badge, Timeline)
- [ ] T049 [US2] Statusverfolgungsseite: `apps/frontend/src/pages/public/TrackReport.tsx` (Eingabe Ticket-ID oder Link aus E-Mail)
- [ ] T050 [US2] Adress-/Schlagwort-Suchleiste: `apps/frontend/src/components/map/SearchBar.tsx`
- [ ] T051 [US2] Navigation und Startseite: `apps/frontend/src/pages/public/Home.tsx` (CTA: Melden / Karte anzeigen)

**Checkpoint**: US2 vollständig – Kartenansicht und Listenansicht funktionieren

---

## Phase 5: User Story 3 – Mitarbeiter-Dashboard (Priority: P3)

**Goal**: Mitarbeitende können sich einloggen, Meldungen bearbeiten und Status ändern

**Independent Test**: Mitarbeiter einloggen → Dashboard öffnen → Meldung filtern → Status ändern → Zeitleisten-Eintrag sehen

### Backend

- [ ] T052 [P] [US3] Auth-Controller für Mitarbeiter: `apps/backend/src/api/controllers/auth.controller.ts` (POST /auth/staff/login, Refresh Token, Logout)
- [ ] T053 [P] [US3] Dashboard-Controller: `apps/backend/src/api/controllers/dashboard.controller.ts` (GET /dashboard/reports mit Filtern)
- [ ] T054 [US3] Status-Workflow-Service: `apps/backend/src/services/status.service.ts` (Statusübergangs-Validierung, StatusEntry erstellen)
- [ ] T055 [US3] PATCH /dashboard/reports/:id/status Endpunkt implementieren (inkl. optionale E-Mail-Benachrichtigung)
- [ ] T056 [US3] PATCH /dashboard/reports/:id/assign Endpunkt implementieren
- [ ] T057 [US3] POST /dashboard/reports/:id/comments Endpunkt: interne Kommentare
- [ ] T058 [US3] Notification-Service: `apps/backend/src/services/notification.service.ts` (Nodemailer, E-Mail-Vorlagen)

### Frontend

- [ ] T059 [P] [US3] Staff-Login-Seite: `apps/frontend/src/pages/admin/StaffLogin.tsx`
- [ ] T060 [P] [US3] Dashboard-Layout mit Sidebar: `apps/frontend/src/components/dashboard/DashboardLayout.tsx`
- [ ] T061 [US3] Meldungstabelle mit Filterung: `apps/frontend/src/pages/admin/ReportsTable.tsx` (sortierbar, Multi-Filter, Pagination)
- [ ] T062 [US3] Meldungs-Detailansicht (intern): `apps/frontend/src/pages/admin/ReportDetail.tsx` (vollständige Infos, interne Kommentare, Statusverlauf)
- [ ] T063 [US3] Status-Änderungs-Dialog: `apps/frontend/src/components/dashboard/StatusChangeDialog.tsx` (Dropdown, Notiz, E-Mail-Option)
- [ ] T064 [US3] Zuweisung-Dropdown: `apps/frontend/src/components/dashboard/AssigneeSelect.tsx`
- [ ] T065 [US3] Interner Kommentar-Editor: `apps/frontend/src/components/dashboard/InternalComment.tsx`
- [ ] T066 [US3] Auth-Store + geschützte Routen: `apps/frontend/src/store/auth.store.ts`, Route Guard für `/admin/*`

**Checkpoint**: US3 vollständig – Mitarbeiter können Meldungen vollständig bearbeiten

---

## Phase 6: User Story 4 – Bürger-Konto (Priority: P4)

**Goal**: Bürger können sich registrieren, einloggen und eigene Meldungen verwalten

**Independent Test**: Registrieren → E-Mail bestätigen → Einloggen → Meine Meldungen sehen → Benachrichtigungen aktivieren

### Backend

- [ ] T067 [P] [US4] Citizen-Auth-Controller: `apps/backend/src/api/controllers/auth.controller.ts` (POST /auth/register, /auth/login, /auth/logout, /auth/reset-password)
- [ ] T068 [P] [US4] Citizen-Reports-Endpunkt: GET /citizen/reports (eingeloggte Bürger, mit History)
- [ ] T069 [US4] E-Mail-Verifikation implementieren: Token-Generierung, Bestätigungs-E-Mail, Verify-Endpunkt
- [ ] T070 [US4] Passwort-Reset-Flow: Token-Generierung, Reset-E-Mail, PATCH /auth/reset-password/:token

### Frontend

- [ ] T071 [P] [US4] Registrierungsformular: `apps/frontend/src/pages/citizen/Register.tsx`
- [ ] T072 [P] [US4] Bürger-Login-Seite: `apps/frontend/src/pages/citizen/Login.tsx`
- [ ] T073 [US4] "Meine Meldungen"-Übersicht: `apps/frontend/src/pages/citizen/MyReports.tsx` (Status-Timeline je Meldung)
- [ ] T074 [US4] Passwort-Reset-Seiten: `apps/frontend/src/pages/citizen/ForgotPassword.tsx`, `ResetPassword.tsx`
- [ ] T075 [US4] Profil-Einstellungen: `apps/frontend/src/pages/citizen/Profile.tsx` (Name, Benachrichtigungen)

**Checkpoint**: US4 vollständig – Bürger-Konto funktioniert

---

## Phase 7: User Story 5 – Admin-Bereich (Priority: P5)

**Goal**: Admins können Kategorien, Mitarbeiter, E-Mail-Vorlagen und Theming verwalten

**Independent Test**: Admin einloggen → Neue Kategorie anlegen → Im Meldeformular erscheint sie sofort

### Backend

- [ ] T076 [P] [US5] Admin-Kategorie-Controller: `apps/backend/src/api/controllers/admin.controller.ts` (CRUD /admin/categories)
- [ ] T077 [P] [US5] Admin-Staff-Controller: CRUD /admin/staff (anlegen, Rolle, deaktivieren)
- [ ] T078 [P] [US5] Admin-Config-Controller: GET/PUT /admin/config (Theming, Stadtname, Karten-Defaults)
- [ ] T079 [US5] Admin-Rollenprüfung: Middleware prüft ADMIN-Rolle für alle `/admin/*` Routen
- [ ] T080 [US5] Statistik-Service + Endpunkt: `apps/backend/src/services/stats.service.ts`, GET /dashboard/stats
- [ ] T081 [US5] Export-Service: `apps/backend/src/services/export.service.ts` (CSV mit papaparse, XLSX mit exceljs)

### Frontend

- [ ] T082 [P] [US5] Kategorienverwaltungs-Seite: `apps/frontend/src/pages/admin/Categories.tsx` (Liste, Formular, Aktivieren/Deaktivieren)
- [ ] T083 [P] [US5] Mitarbeiterverwaltungs-Seite: `apps/frontend/src/pages/admin/Staff.tsx`
- [ ] T084 [P] [US5] Theming-Konfigurationsseite: `apps/frontend/src/pages/admin/Config.tsx` (Farbpicker, Logo-Upload, Stadtname)
- [ ] T085 [US5] KPI-Dashboard: `apps/frontend/src/pages/admin/Stats.tsx` (Charts mit recharts, Balken- und Tortendiagramme)
- [ ] T086 [US5] Massenbearbeitungs-Toolbar: `apps/frontend/src/components/dashboard/BulkActions.tsx`
- [ ] T087 [US5] Export-Button in Tabelle: CSV/XLSX-Download triggern

**Checkpoint**: US5 vollständig – Vollständige Admin-Funktionalität verfügbar

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Qualität, Performance, Barrierefreiheit und Dokumentation

- [ ] T088 [P] axe-core Accessibility-Tests für alle Seiten: `apps/frontend/tests/a11y/`
- [ ] T089 [P] Unit-Tests für Report-Service: `apps/backend/tests/unit/report.service.test.ts`
- [ ] T090 [P] Unit-Tests für Status-Workflow: `apps/backend/tests/unit/status.service.test.ts`
- [ ] T091 [P] Integration-Tests für Report-Endpunkte: `apps/backend/tests/integration/reports.test.ts` (Supertest)
- [ ] T092 [P] Integration-Tests für Auth-Endpunkte: `apps/backend/tests/integration/auth.test.ts`
- [ ] T093 Swagger UI einbinden: `apps/backend/src/lib/swagger.ts` (swagger-jsdoc + swagger-ui-express, Endpunkt `/api/docs`)
- [ ] T094 [P] Responsive Design prüfen und korrigieren: alle Seiten auf 375px, 768px, 1280px
- [ ] T095 [P] Lighthouse-Performance-Audit durchführen und Optimierungen umsetzen (Ziel: Initial Load < 3s)
- [ ] T096 GitHub Actions Deploy-Workflow: `.github/workflows/deploy.yml`
- [ ] T097 `quickstart.md` mit vollständiger lokaler Setup-Anleitung aktualisieren
- [ ] T098 OpenAPI-Dokumentation finalisieren und mit Implementierung abgleichen
- [ ] T099 DSGVO-Konformitätsprüfung: alle personenbezogenen Datenflüsse dokumentieren

---

## Dependencies & Execution Order

### Phase-Abhängigkeiten

- **Phase 1 (Setup)**: Keine – kann sofort beginnen
- **Phase 2 (Foundational)**: Depends on Phase 1 – BLOCKIERT alle User Stories
- **Phase 3–7 (User Stories)**: Alle abhängig von Phase 2
  - Können sequenziell (P1→P2→P3→P4→P5) oder parallel (bei mehreren Entwicklern) bearbeitet werden
- **Phase 8 (Polish)**: Abhängig von allen gewünschten User Stories

### User Story Abhängigkeiten

- **US1 (P1)**: Starten nach Phase 2 – MVP, keine Abhängigkeiten
- **US2 (P2)**: Starten nach Phase 2 – nutzt Report-Daten aus US1-Backend
- **US3 (P3)**: Starten nach Phase 2 – nutzt alle Report-Daten
- **US4 (P4)**: Starten nach Phase 2 – nutzt Report-Daten aus US1
- **US5 (P5)**: Starten nach Phase 2 – nutzt Kategorie- und Konfigurationsdaten

### Parallel-Opportunitäten innerhalb einer Story

- Backend- und Frontend-Tasks einer Story können parallel bearbeitet werden
- Mehrere Modell-/Service-Dateien innerhalb einer Phase können parallel bearbeitet werden

---

## Implementation Strategy

### MVP First (User Story 1 – Anonyme Meldung)

1. Phase 1: Setup abschließen
2. Phase 2: Foundational abschließen (KRITISCH)
3. Phase 3: User Story 1 implementieren
4. **STOP & VALIDIEREN**: Anonyme Meldung End-to-End testen
5. Auf GitHub pushen und deployen

### Incremental Delivery

1. MVP: US1 → Bürger kann melden
2. +US2 → Karte und Liste sichtbar
3. +US3 → Verwaltung kann bearbeiten
4. +US4 → Bürger-Konto
5. +US5 → Admin-Konfiguration
6. Phase 8 → Qualitätssicherung

---

## Summary

| Metrik | Wert |
|--------|------|
| Gesamtanzahl Tasks | 99 |
| Phase 1 (Setup) | 11 |
| Phase 2 (Foundational) | 16 |
| US1 – Anonyme Meldung (P1) | 13 |
| US2 – Karte & Liste (P2) | 11 |
| US3 – Mitarbeiter-Dashboard (P3) | 15 |
| US4 – Bürger-Konto (P4) | 9 |
| US5 – Admin-Bereich (P5) | 12 |
| Phase 8 (Polish) | 12 |
| Parallelisierbare Tasks [P] | ~50% |

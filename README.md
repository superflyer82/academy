# Mängelmelder Musterhausen

Ein digitales Bürger-Meldeportal für städtische Mängel – DSGVO-konform, barrierefrei, und vollständig konfigurierbar.

## Features

- **Anonyme Meldungen** – Bürger können Mängel ohne Registrierung einreichen
- **Interaktive Karte** – OpenStreetMap mit allen öffentlichen Meldungen
- **Duplikat-Erkennung** – Warnt bei ähnlichen Meldungen im Umkreis von 100m
- **Foto-Upload** – Bis zu 3 Fotos pro Meldung
- **Ticket-Verfolgung** – Statusverfolgung per öffentlicher Ticket-ID
- **Staff-Dashboard** – Meldungen verwalten, Status ändern, Massenbearbeitung
- **Bürgerkonto** – Optionale Registrierung für Statusbenachrichtigungen
- **Admin-Panel** – Kategorien, Mitarbeiter und Konfiguration verwalten
- **Statistiken** – KPI-Dashboard mit Statusverteilung
- **Export** – CSV- und Excel-Export der Meldungen
- **WCAG 2.1 AA** – Barrierefreie Bedienung
- **i18n** – Deutsche Oberfläche (erweiterbar)

## Tech Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand + TanStack Query |
| Karte | Leaflet + React-Leaflet |
| Backend | Node.js + Express + TypeScript |
| Datenbank | PostgreSQL + Prisma ORM |
| Auth | JWT (Access + Refresh Token) |
| Upload | Multer (lokal, S3-erweiterbar) |
| E-Mail | Nodemailer (SMTP) |
| Monorepo | Turborepo + npm Workspaces |

## Projektstruktur

```
├── apps/
│   ├── frontend/          # React-Frontend
│   └── backend/           # Express-API
├── packages/
│   └── shared-types/      # Gemeinsame TypeScript-Typen
├── specs/
│   └── 001-maengelmelder-platform/   # Design-Dokumente
├── docker-compose.yml     # Lokale PostgreSQL
├── .env.example           # Konfigurationsvorlage
└── turbo.json             # Turborepo-Konfiguration
```

## Schnellstart

Siehe [specs/001-maengelmelder-platform/quickstart.md](specs/001-maengelmelder-platform/quickstart.md)

```bash
# 1. Dependencies installieren
npm install

# 2. .env konfigurieren
cp .env.example .env

# 3. Datenbank starten
docker-compose up -d

# 4. Migration und Seed
cd apps/backend && npx prisma migrate dev --name init && npx prisma db seed && cd ../..

# 5. Entwicklungsserver starten
npm run dev
```

## Routen

### Öffentlich
| Route | Beschreibung |
|-------|-------------|
| `/` | Startseite |
| `/melden` | Meldung einreichen |
| `/melden/erfolg/:token` | Bestätigungsseite |
| `/karte` | Kartenübersicht |
| `/meldungen` | Listenansicht |
| `/meldungen/:id` | Detailansicht |
| `/verfolgen/:token` | Statusverfolgung |

### Bürger
| Route | Beschreibung |
|-------|-------------|
| `/registrieren` | Konto erstellen |
| `/anmelden` | Einloggen |
| `/meine-meldungen` | Meine Meldungen |

### Staff / Admin
| Route | Beschreibung |
|-------|-------------|
| `/dashboard/login` | Mitarbeiter-Login |
| `/dashboard` | Meldungsliste |
| `/dashboard/meldungen/:id` | Meldungsdetail |
| `/dashboard/statistiken` | KPI-Übersicht |
| `/dashboard/kategorien` | Kategorienverwaltung |
| `/dashboard/mitarbeiter` | Mitarbeiterverwaltung |
| `/dashboard/einstellungen` | Systemkonfiguration |

## API

Basis-URL: `/api/v1`

Vollständige OpenAPI-Spezifikation: [specs/001-maengelmelder-platform/contracts/api.yml](specs/001-maengelmelder-platform/contracts/api.yml)

Swagger UI: `http://localhost:3001/api-docs` (im Dev-Modus)

## Lizenz

MIT

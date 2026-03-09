# Implementation Plan: Mängelmelder Musterhausen

**Branch**: `001-maengelmelder-platform` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-maengelmelder-platform/spec.md`

## Summary

Aufbau einer vollständigen Bürger-Meldeplattform für die Stadt Musterhausen als Monorepo (Frontend + Backend). Bürger können ohne Registrierung Mängel im öffentlichen Raum melden, auf einer interaktiven Karte einsehen und per Ticket-ID verfolgen. Mitarbeitende der Stadtverwaltung bearbeiten Meldungen über ein internes Dashboard. Der Tech-Stack folgt der Constitution: React + TypeScript (Frontend), Node.js + Express + TypeScript (Backend), PostgreSQL + Prisma (Datenbank).

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend + Backend)
**Primary Dependencies**: React 18, Vite, Tailwind CSS, shadcn/ui, Leaflet, Express 4, Prisma 5, JWT, Nodemailer, Multer
**Storage**: PostgreSQL 15 (Prisma ORM), lokaler Dateispeicher für Fotos (S3-kompatibel erweiterbar)
**Testing**: Vitest + React Testing Library (Frontend), Jest + Supertest (Backend), axe-core (Accessibility)
**Target Platform**: Web (Browser), primär Mobile-First; Node.js 20 LTS (Server)
**Project Type**: Monorepo Web-Applikation (Frontend + Backend + Shared Types)
**Performance Goals**: Initial Load < 3s auf 4G, Kartenrendering < 500ms für 1000 Marker
**Constraints**: WCAG 2.1 AA, DSGVO-konform, HTTPS-only, CSRF-Schutz
**Scale/Scope**: Einzelstadt-Betrieb, ~100 Meldungen/Tag (Auslegung für bis zu 10.000 Meldungen gesamt)

## Constitution Check

| Prinzip | Status | Anmerkung |
|---------|--------|-----------|
| I. Bürger-Zentriertheit | ✅ | Anonyme Meldung als P1-Feature; Mobile-First-Design |
| II. API-First & Monorepo | ✅ | REST-API (OpenAPI), Monorepo-Struktur, Shared Types |
| III. Datenschutz & Sicherheit | ✅ | JWT, CSRF, HTTPS, optionale Anonymität |
| IV. Barrierefreiheit | ✅ | axe-core in CI, WCAG 2.1 AA als Success Criterion |
| V. Testbarkeit & Qualität | ✅ | Vitest + Jest + Supertest, axe-core, ESLint + Prettier |
| VI. Konfigurierbarkeit | ✅ | Kategorien in DB, Theming per Admin-UI, ENV-Vars |

**Ergebnis**: Alle Gates bestanden. Keine Compliance-Verletzungen.

## Project Structure

### Documentation (this feature)

```text
specs/001-maengelmelder-platform/
├── plan.md              # Dieses Dokument
├── research.md          # Phase 0: Technische Entscheidungen
├── data-model.md        # Phase 1: Datenmodell
├── quickstart.md        # Phase 1: Setup-Anleitung
├── contracts/           # Phase 1: API-Contracts (OpenAPI)
│   └── api.yml
└── tasks.md             # Phase 2: Aufgabenliste (via /speckit.tasks)
```

### Source Code (repository root)

```text
apps/
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui Basiskomponenten
│   │   │   ├── map/             # Karten-Komponenten (Leaflet)
│   │   │   ├── report/          # Meldeformular-Wizard
│   │   │   └── dashboard/       # Verwaltungs-Dashboard
│   │   ├── pages/
│   │   │   ├── public/          # Bürger-Seiten (Startseite, Karte, Formular)
│   │   │   ├── citizen/         # Eingeloggte Bürger (Meine Meldungen)
│   │   │   └── admin/           # Verwaltungs-Dashboard + Admin
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── services/            # API-Client-Funktionen
│   │   ├── store/               # Zustand (Zustand oder Context)
│   │   ├── i18n/                # Übersetzungen (de/)
│   │   └── lib/                 # Utilities
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── a11y/                # axe-core Accessibility-Tests
│
├── backend/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/          # Express Router (reports, categories, auth, admin)
│   │   │   ├── controllers/     # Request Handler
│   │   │   └── middleware/      # Auth, CSRF, Upload, Validation
│   │   ├── services/            # Business Logic
│   │   │   ├── report.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── upload.service.ts
│   │   │   └── export.service.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # DB-Schema
│   │   │   └── seed.ts          # Initialdaten (Kategorien)
│   │   └── lib/                 # Utilities (JWT, Logger, Mailer)
│   └── tests/
│       ├── unit/
│       └── integration/         # Supertest API-Tests
│
packages/
└── shared-types/                # Gemeinsame TypeScript-Typen
    └── src/
        ├── report.types.ts
        ├── category.types.ts
        ├── user.types.ts
        └── api.types.ts         # Request/Response DTOs

.github/
└── workflows/
    ├── ci.yml                   # Tests + Linting
    └── deploy.yml               # Deployment

docker-compose.yml               # Lokale Entwicklung (PostgreSQL)
.env.example                     # Dokumentierte ENV-Variablen
README.md
```

**Structure Decision**: Monorepo mit Turborepo als Build-System. Frontend und Backend als separate Apps, Shared Types als Package.

## Complexity Tracking

Keine Constitution-Verletzungen. Keine Komplexitätsbegründungen erforderlich.
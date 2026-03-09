# CLAUDE.md – Mängelmelder Musterhausen

## Project Context

Mängelmelder Musterhausen – Bürger-Meldeplattform für Mängel im öffentlichen Raum.

**Constitution**: `.specify/memory/constitution.md` (in `maengelmelder/` subfolder)
**Current Feature Branch**: `001-maengelmelder-platform`
**Spec**: `specs/001-maengelmelder-platform/spec.md`
**Plan**: `specs/001-maengelmelder-platform/plan.md`
**API Contract**: `specs/001-maengelmelder-platform/contracts/api.yml`

## Tech Stack

<!-- SPECKIT:BEGIN -->
- **Language**: TypeScript 5.x (Frontend + Backend)
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Leaflet + React-Leaflet
- **Backend**: Node.js 20 LTS, Express 4, Prisma 5, JWT, Nodemailer, Multer
- **Database**: PostgreSQL 15 (Prisma ORM)
- **Project Type**: Monorepo (Turborepo) – apps/frontend, apps/backend, packages/shared-types
- **Testing**: Vitest + React Testing Library (Frontend), Jest + Supertest (Backend), axe-core (A11y)
<!-- SPECKIT:END -->

## Key Conventions

- Alle API-Endpunkte folgen dem OpenAPI-Contract in `specs/001-maengelmelder-platform/contracts/api.yml`
- Shared Types IMMER in `packages/shared-types` definieren, nie duplizieren
- Konfiguration IMMER über ENV-Variablen, nie hardcoden
- Jedes Feature braucht Tests (Unit + Integration) bevor es als fertig gilt
- WCAG 2.1 AA ist Pflicht – axe-core-Tests für alle neuen Komponenten
- Deutsche UI-Texte via i18n (react-i18next), keine hardcodierten Strings in Komponenten

## Directory Structure

```
apps/frontend/       – React + Vite Frontend
apps/backend/        – Express + Prisma Backend
packages/shared-types/ – Gemeinsame TypeScript-Typen
specs/               – SpecKit Artifacts (Spec, Plan, Tasks)
maengelmelder/       – SpecKit Konfiguration (.specify/, .claude/)
```

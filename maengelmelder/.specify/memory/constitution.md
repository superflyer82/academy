<!-- Sync Impact Report
Version change: 0.0.0 (template) → 1.0.0 (initial ratification)
Added sections: Core Principles (I–VI), Tech Stack, Quality Gates, Governance
Removed sections: None (initial version)
Templates requiring updates:
  ✅ constitution.md (this file)
  ✅ plan-template.md (aligned with API-First + Monorepo)
  ✅ spec-template.md (aligned with DSGVO + Barrierefreiheit constraints)
  ✅ tasks-template.md (aligned with Testing + CI/CD principles)
Follow-up TODOs: None
-->

# Mängelmelder Musterhausen Constitution

## Core Principles

### I. Bürger-Zentriertheit (Citizen-First)
Jede Entscheidung stellt die Bürgerin und den Bürger in den Mittelpunkt.
- Meldungen MÜSSEN ohne Registrierung möglich sein (anonyme Nutzung)
- UX MUSS auf Mobilgeräten primär gedacht und getestet werden
- Prozesse MÜSSEN verständlich und transparent sein (Ticket-ID, Statusverfolgung)
- Daten DÜRFEN nur im Minimum erhoben werden (Datensparsamkeit nach DSGVO)

### II. API-First & Monorepo
Das System wird als API-First-Architektur im Monorepo entwickelt.
- Alle Funktionen MÜSSEN über eine dokumentierte REST-API (OpenAPI/Swagger) zugänglich sein
- Frontend ist rein client-seitig; es darf KEINE direkte DB-Kommunikation aus dem Frontend geben
- Monorepo-Struktur: `apps/frontend`, `apps/backend`, `packages/shared-types`
- Shared Types MÜSSEN in `packages/shared-types` zentral definiert und versioniert werden
- Konfiguration MUSS über ENV-Variablen erfolgen; keine Hardcodes im Code

### III. Datenschutz & Sicherheit (DSGVO-Konformität)
Datenschutz ist kein nachträgliches Feature, sondern ein Designprinzip.
- HTTPS ist obligatorisch; HTTP DARF NICHT in Produktion verwendet werden
- CSRF-Schutz, Input-Sanitization und sichere Authentifizierung (JWT + Refresh Tokens) MÜSSEN implementiert sein
- Personenbezogene Daten DÜRFEN NUR mit expliziter Einwilligung gespeichert werden
- Anonyme Meldungen MÜSSEN vollständig anonym bleiben (kein IP-Logging ohne Rechtsgrundlage)
- Öffentliche Sichtbarkeit von Meldungen MUSS konfigurierbar sein

### IV. Barrierefreiheit (WCAG 2.1 Level AA)
Die Anwendung MUSS für alle Menschen nutzbar sein.
- Alle interaktiven Elemente MÜSSEN per Tastatur bedienbar sein
- Farbkontraste MÜSSEN WCAG 2.1 AA-Anforderungen erfüllen (Kontrastverhältnis ≥ 4.5:1)
- Screen-Reader-Kompatibilität MUSS bei jedem neuen Feature geprüft werden
- Automatisierte Accessibility-Tests (z.B. axe-core) MÜSSEN in die CI/CD-Pipeline integriert sein

### V. Testbarkeit & Qualität
Qualität ist eingebaut, nicht nachträglich geprüft.
- Unit-Tests MÜSSEN für die gesamte Business-Logik im Backend vorhanden sein
- Integration-Tests MÜSSEN alle API-Endpunkte abdecken
- Frontend-Tests MÜSSEN kritische User Journeys abdecken (Meldeformular, Login, Dashboard)
- Kein Feature gilt als fertig ohne zugehörige Tests (Definition of Done)
- Code MUSS per Linter (ESLint) und Formatter (Prettier) geprüft sein, bevor ein PR gemergt wird

### VI. Konfigurierbarkeit & Erweiterbarkeit
Das System MUSS ohne Code-Änderungen an neue Anforderungen angepasst werden können.
- Kategorien MÜSSEN in der Datenbank verwaltet werden, NICHT im Code hardcodiert sein
- Theming (Stadtname, Logo, Primärfarbe) MUSS über Admin-UI konfigurierbar sein
- E-Mail-Vorlagen MÜSSEN über Admin-UI verwaltbar sein
- Neue Kategorien und Funktionen MÜSSEN ohne größere Refactorings hinzufügbar sein
- i18n-Struktur (react-i18next) MUSS von Anfang an vorgesehen sein; Deutsch ist die Hauptsprache

## Tech Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Karte | Leaflet + React-Leaflet |
| Backend | Node.js + Express + TypeScript |
| Datenbank | PostgreSQL + Prisma ORM |
| Auth | JWT + Refresh Tokens |
| Datei-Upload | Multer + lokaler Speicher (S3-kompatibel erweiterbar) |
| Tests | Vitest (Frontend), Jest + Supertest (API) |
| CI/CD | GitHub Actions |
| Dokumentation | OpenAPI/Swagger |

Abweichungen vom empfohlenen Tech-Stack MÜSSEN im Plan dokumentiert und begründet werden.

## Quality Gates

Jedes Feature MUSS folgende Kriterien erfüllen, bevor es als fertig gilt:

- [ ] Unit-Tests vorhanden und grün
- [ ] Integration-Tests (API) vorhanden und grün
- [ ] Accessibility-Check (axe-core) ohne kritische Fehler
- [ ] OpenAPI-Dokumentation aktualisiert
- [ ] ENV-Variablen in `.env.example` dokumentiert
- [ ] Responsive Design auf Mobile/Tablet/Desktop geprüft
- [ ] DSGVO-Konformität geprüft (keine unnötigen Daten erhoben)

## Governance

Diese Constitution ist das übergeordnete Regelwerk für das Projekt Mängelmelder Musterhausen. Sie hat Vorrang vor allen anderen Praktiken und Konventionen.

**Änderungsverfahren:**
- Änderungen an der Constitution erfordern eine explizite Versionierung (Semantic Versioning)
- MAJOR: Prinzipien werden entfernt oder grundlegend neu definiert
- MINOR: Neue Prinzipien oder Abschnitte werden hinzugefügt
- PATCH: Klarstellungen, Formulierungen, Tippfehler
- Jede Änderung MUSS mit einem Sync Impact Report dokumentiert werden

**Compliance:**
- Alle PRs MÜSSEN auf Einhaltung dieser Constitution geprüft werden
- Abweichungen MÜSSEN explizit begründet und dokumentiert werden

**Version**: 1.0.0 | **Ratified**: 2026-03-09 | **Last Amended**: 2026-03-09

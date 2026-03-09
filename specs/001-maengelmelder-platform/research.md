# Research: Mängelmelder Musterhausen

**Phase 0 – Technische Entscheidungen**
**Date**: 2026-03-09

## Monorepo Build-System

- **Decision**: Turborepo
- **Rationale**: Einfache Konfiguration, gute Integration mit npm workspaces, schnelle inkrementelle Builds, weit verbreitet in React-Projekten
- **Alternatives considered**: nx (komplexer, mehr Overhead für dieses Projektgröße), Lerna (veraltet)

## State Management (Frontend)

- **Decision**: Zustand (für globalen State) + React Query / TanStack Query (für Server State)
- **Rationale**: Zustand ist minimal und ohne Boilerplate; TanStack Query verwaltet Caching, Loading und Error States für API-Calls automatisch
- **Alternatives considered**: Redux Toolkit (zu viel Overhead für diesen Anwendungsfall), Context API allein (kein Server-State-Management)

## Karten-Bibliothek

- **Decision**: Leaflet + React-Leaflet + leaflet.markercluster
- **Rationale**: Open Source, keine API-Key-Kosten, große Community, OpenStreetMap-kompatibel, React-Leaflet bietet native React-Integration
- **Alternatives considered**: Mapbox GL (kostenpflichtig ab gewissem Traffic), Google Maps (Kosten + Datenschutz)

## Authentifizierung

- **Decision**: JWT (Access Token 15 min) + Refresh Token (7 Tage, httpOnly Cookie) für Mitarbeiter; bcrypt für Passwort-Hashing
- **Rationale**: Bewährter Standard, zustandslos (kein Session-Store nötig), httpOnly Cookie verhindert XSS-Zugriff auf Refresh Token
- **Alternatives considered**: NextAuth.js (nicht nötig, da kein Next.js), Session-basiert (erfordert Session-Store)

## E-Mail-Versand

- **Decision**: Nodemailer mit konfigurierbarem SMTP-Transport
- **Rationale**: Einfach konfigurierbar, kein Vendor Lock-in, funktioniert mit jedem SMTP-Anbieter (SendGrid, Mailgun, eigener Server)
- **Alternatives considered**: SendGrid SDK (Vendor Lock-in), AWS SES (zu komplex für diesen Use Case)

## Foto-Speicherung

- **Decision**: Multer (lokaler Speicher), abstrahiert hinter einem Upload-Service; S3-kompatible Erweiterung vorbereitet
- **Rationale**: Einfachst mögliche Implementierung; Abstraktion erlaubt spätere Migration zu S3/MinIO ohne API-Änderungen
- **Alternatives considered**: Direkt S3 (unnötige Komplexität für v1), Base64 in DB (Performance-Problem)

## API-Dokumentation

- **Decision**: OpenAPI 3.0 (YAML), generiert über swagger-jsdoc + swagger-ui-express
- **Rationale**: Standard-Format, Tool-Support, ermöglicht spätere Code-Generierung für mobile Apps
- **Alternatives considered**: GraphQL (Overkill für diesen Use Case), manuelle Dokumentation (veraltet schnell)

## Duplikaterkennung

- **Decision**: Radius-basierte Prüfung (PostgreSQL Haversine-Formel), Schwellwert: 100m Radius + gleiche Kategorie + Status != RESOLVED
- **Rationale**: Einfach zu implementieren, kein ML-Overhead, ausreichend für den Use Case
- **Alternatives considered**: ML-basierte Ähnlichkeitserkennung (Overkill), manuelle Prüfung (kein Mehrwert für Bürger)

## Barrierefreiheit-Testing

- **Decision**: axe-core via vitest-axe (Unit Tests) + Playwright + axe (E2E)
- **Rationale**: axe-core ist der Industriestandard für automatisierte A11y-Prüfung, gute Integration in CI
- **Alternatives considered**: Lighthouse CI (weniger granular), manuelle Tests allein (nicht skalierbar)

## DSGVO-Konformität

- **Decision**: Keine IP-Speicherung für anonyme Meldungen; personenbezogene Daten (Name, E-Mail) nur mit expliziter Angabe; publicToken für anonyme Statusverfolgung (UUID, nicht erratbar)
- **Rationale**: Datensparsamkeit-Prinzip; publicToken ermöglicht Verfolgung ohne Personenbezug
- **Alternatives considered**: IP-basierte Rückverfolgung (DSGVO-problematisch ohne Rechtsgrundlage)

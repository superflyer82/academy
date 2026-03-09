# Quickstart: Mängelmelder Musterhausen

## Voraussetzungen

- Node.js 20+
- Docker & Docker Compose
- npm 10+

## Lokale Entwicklung

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Minimal-Konfiguration in `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/maengelmelder
JWT_ACCESS_SECRET=dev-secret-access-change-in-prod
JWT_REFRESH_SECRET=dev-secret-refresh-change-in-prod
UPLOAD_DIR=./apps/backend/uploads
VITE_API_URL=http://localhost:3001/api/v1
```

### 3. Datenbank starten

```bash
docker-compose up -d
```

### 4. Prisma-Migration und Seed ausführen

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
```

Der Seed erstellt:
- 9 Standard-Kategorien (Straßenschaden, Beleuchtung, Grünflächen, etc.)
- Admin-Benutzer: `admin@musterhausen.de` / `Admin1234!`
- Basis-Konfiguration

### 5. Anwendung starten

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/v1
- **API Docs (Swagger)**: http://localhost:3001/api-docs

## Testszenarien

### US1: Anonyme Meldung einreichen

1. http://localhost:5173/melden aufrufen
2. Kategorie "Straßenschaden" wählen
3. Standort auf der Karte setzen
4. Beschreibung eingeben
5. Formular absenden
6. Ticket-ID notieren
7. Bestätigungsseite zeigt Ticket-ID + Link zum Verfolgen

**Erwartetes Ergebnis**: Meldung in DB, Ticket-ID im Format UUID

### US2: Karte und Liste

1. http://localhost:5173/karte aufrufen
2. Marker der soeben erstellten Meldung sehen
3. Marker klicken → Popup mit Kategorie, Status, Datum
4. "Details anzeigen" → Detailseite mit Karte
5. http://localhost:5173/meldungen → Listenansicht
6. Nach Kategorie filtern

**Erwartetes Ergebnis**: Meldungen auf Karte und in Liste sichtbar

### US3: Staff-Dashboard

1. http://localhost:5173/dashboard/login
2. Login mit `admin@musterhausen.de` / `Admin1234!`
3. Meldungsliste mit Filter- und Sortierfunktion
4. Meldung öffnen → Detailansicht
5. Status von "Eingegangen" zu "In Bearbeitung" ändern
6. Interne Notiz hinzufügen
7. http://localhost:5173/dashboard/statistiken → KPI-Übersicht

**Erwartetes Ergebnis**: Status aktualisiert, Verlauf sichtbar

### US4: Bürgerkonto

1. http://localhost:5173/registrieren → Konto erstellen
2. http://localhost:5173/melden → Meldung einreichen (eingeloggt)
3. http://localhost:5173/meine-meldungen → Meldungen mit Statusverlauf

**Erwartetes Ergebnis**: Meldung im Bürgerkonto sichtbar

### US5: Admin-Konfiguration

1. Als Admin einloggen
2. http://localhost:5173/dashboard/kategorien → Kategorie hinzufügen/bearbeiten
3. http://localhost:5173/dashboard/mitarbeiter → Mitarbeiter anlegen
4. http://localhost:5173/dashboard/einstellungen → Stadtname konfigurieren

## Tests ausführen

```bash
# Alle Tests
npm test

# Frontend Tests
cd apps/frontend && npm test

# Backend Tests
cd apps/backend && npm test
```

## Build für Produktion

```bash
npm run build
```

Output: `apps/frontend/dist/` und `apps/backend/dist/`

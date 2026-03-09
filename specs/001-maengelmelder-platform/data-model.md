# Data Model: Mängelmelder Musterhausen

**Phase 1 – Datenmodell**
**Date**: 2026-03-09

## Entities

### Report (Meldung)

Kernobjekt der Plattform. Repräsentiert eine Bürger-Meldung.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| createdAt | DateTime | Erstellungszeitpunkt | Auto |
| updatedAt | DateTime | Letzte Änderung | Auto |
| categoryId | UUID | Fremdschlüssel → Category | Pflichtfeld |
| title | String? | Optionaler Titel | max. 100 Zeichen |
| description | String? | Freitextbeschreibung | max. 2000 Zeichen |
| status | Enum | Aktueller Status | Siehe Status-Enum |
| priority | Enum | Priorität | Siehe Priority-Enum |
| lat | Float | Breitengrad | -90 bis 90, Pflichtfeld |
| lng | Float | Längengrad | -180 bis 180, Pflichtfeld |
| address | String? | Adresse (optional, Geocoding) | max. 500 Zeichen |
| reporterName | String? | Name des Melders | max. 100 Zeichen |
| reporterEmail | String? | E-Mail des Melders | gültige E-Mail |
| isAnonymous | Boolean | Anonyme Meldung | Default: true wenn keine Kontaktdaten |
| notifyOnUpdate | Boolean | E-Mail-Benachrichtigung gewünscht | Default: false |
| publicToken | UUID | Token für anonyme Statusverfolgung | Auto-generiert, einzigartig |
| assignedToId | UUID? | Fremdschlüssel → StaffUser | Optional |
| citizenId | UUID? | Fremdschlüssel → Citizen | Optional (wenn eingeloggt) |

**Status-Enum**: `OPEN` | `IN_PROGRESS` | `RESOLVED` | `REJECTED` | `PENDING_RESPONSE`
**Priority-Enum**: `LOW` | `MEDIUM` | `HIGH` | `URGENT`

**Beziehungen**:
- belongs to `Category`
- has many `Photo`
- has many `InternalComment`
- has many `StatusEntry`
- belongs to `StaffUser` (optional, Zuweisung)
- belongs to `Citizen` (optional)

**State Transitions**:
```
OPEN → IN_PROGRESS
OPEN → REJECTED
IN_PROGRESS → RESOLVED
IN_PROGRESS → REJECTED
IN_PROGRESS → PENDING_RESPONSE
PENDING_RESPONSE → IN_PROGRESS
PENDING_RESPONSE → RESOLVED
```

---

### Category (Kategorie)

Konfigurierbare Mängelkategorie, verwaltet durch Admins.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| name | String | Anzeigename | Pflichtfeld, max. 100 Zeichen |
| icon | String | Emoji oder Icon-Identifier | Pflichtfeld |
| color | String | Hex-Farbe für Karten-Marker | Format: #RRGGBB |
| responsibleDepartment | String | Zuständiges Amt | Pflichtfeld |
| targetResolutionDays | Int | Bearbeitungsziel in Tagen | Pflichtfeld, min. 1 |
| isActive | Boolean | Aktiv/Inaktiv | Default: true |
| sortOrder | Int | Reihenfolge im Formular | Default: 0 |

---

### StaffUser (Mitarbeiter)

Interner Nutzer der Stadtverwaltung.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| email | String | E-Mail-Adresse | Pflichtfeld, einzigartig |
| passwordHash | String | bcrypt-Hash | Intern, nie exponiert |
| name | String | Vollständiger Name | Pflichtfeld |
| role | Enum | Rolle | STAFF oder ADMIN |
| department | String? | Abteilung | Optional |
| isActive | Boolean | Konto aktiv | Default: true |
| createdAt | DateTime | Erstellungszeitpunkt | Auto |
| lastLoginAt | DateTime? | Letzter Login | Optional |

**Role-Enum**: `STAFF` | `ADMIN`

---

### Citizen (Bürger, optional registriert)

Registrierter Bürger-Account.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| email | String | E-Mail-Adresse | Pflichtfeld, einzigartig |
| passwordHash | String | bcrypt-Hash | Intern, nie exponiert |
| name | String | Name | Pflichtfeld |
| emailVerified | Boolean | E-Mail bestätigt | Default: false |
| notifyOnUpdate | Boolean | Benachrichtigungen | Default: true |
| createdAt | DateTime | Erstellungszeitpunkt | Auto |

---

### Photo (Foto)

Bild-Anhang einer Meldung.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| url | String | Pfad/URL zum Bild | Pflichtfeld |
| filename | String | Originaldateiname | Pflichtfeld |
| mimeType | String | MIME-Typ | jpg, jpeg, png, webp |
| sizeBytes | Int | Dateigröße | max. 10 MB |
| reportId | UUID | Fremdschlüssel → Report | Pflichtfeld |
| createdAt | DateTime | Upload-Zeitpunkt | Auto |

**Validierungen**: max. 3 Fotos pro Meldung; erlaubte Typen: image/jpeg, image/png, image/webp

---

### InternalComment (Interner Kommentar)

Interne Notiz eines Mitarbeiters. Nie öffentlich sichtbar.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| text | String | Kommentartext | Pflichtfeld, max. 5000 Zeichen |
| reportId | UUID | Fremdschlüssel → Report | Pflichtfeld |
| authorId | UUID | Fremdschlüssel → StaffUser | Pflichtfeld |
| createdAt | DateTime | Erstellungszeitpunkt | Auto |

---

### StatusEntry (Status-Eintrag)

Protokolleintrag für jeden Statuswechsel.

| Feld | Typ | Beschreibung | Validierung |
|------|-----|--------------|-------------|
| id | UUID | Primärschlüssel | Auto-generiert |
| fromStatus | Enum? | Ausgangsstatus | Null bei erster Erstellung |
| toStatus | Enum | Zielstatus | Pflichtfeld |
| note | String? | Optionale Notiz | max. 1000 Zeichen |
| reportId | UUID | Fremdschlüssel → Report | Pflichtfeld |
| authorId | UUID? | Fremdschlüssel → StaffUser | Null bei Bürgermeldung |
| createdAt | DateTime | Zeitpunkt des Wechsels | Auto |

---

### AppConfig (Konfiguration)

Key-Value-Store für Anwendungskonfiguration (Theming, Einstellungen).

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| key | String | Konfigurationsschlüssel (PK) |
| value | String | Wert (JSON-serialisierbar) |
| updatedAt | DateTime | Letzte Änderung |

**Standard-Schlüssel**: `city.name`, `city.logo`, `city.primaryColor`, `city.defaultLat`, `city.defaultLng`, `city.defaultZoom`

## Beziehungs-Diagramm

```
Category ──< Report >── StaffUser (Zuweisung)
                │
                ├──< Photo
                ├──< InternalComment >── StaffUser (Autor)
                └──< StatusEntry >── StaffUser (Autor)

Citizen ──< Report

AppConfig (unabhängig)
```

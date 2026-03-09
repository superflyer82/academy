# Feature Specification: Mängelmelder Musterhausen

**Feature Branch**: `001-maengelmelder-platform`
**Created**: 2026-03-09
**Status**: Draft
**Input**: Vollständige Plattform für Bürgermeldungen im öffentlichen Raum der Stadt Musterhausen

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Anonyme Meldung einreichen (Priority: P1)

Eine Bürgerin meldet ohne Registrierung ein Schlagloch auf einer Straße. Sie öffnet die Website auf ihrem Smartphone, wählt die Kategorie "Straßenschäden", gibt eine kurze Beschreibung ein, fotografiert den Schaden, markiert den Standort auf der Karte und sendet die Meldung ab. Sie erhält eine Ticket-ID zur späteren Statusverfolgung.

**Why this priority**: Dies ist das Kernfeature der Plattform. Ohne diese Funktion gibt es keinen Mehrwert. Anonymität senkt die Hemmschwelle zur Teilnahme.

**Independent Test**: Kann vollständig durch einen Nutzer ohne Konto getestet werden. Ergebnis: Meldung erscheint im Admin-Dashboard mit korrekten Daten.

**Acceptance Scenarios**:

1. **Given** ein nicht eingeloggter Nutzer, **When** er das Formular ausfüllt (Kategorie + Standort als Pflichtfelder) und absendet, **Then** erhält er eine einzigartige Ticket-ID und die Meldung erscheint im System mit Status "Neu"
2. **Given** ein Nutzer hat alle Pflichtfelder ausgefüllt, **When** er auf "Absenden" klickt, **Then** sieht er eine Bestätigungsseite mit Ticket-ID und Hinweis auf Statusverfolgung
3. **Given** ein Nutzer gibt keine Kontaktdaten an, **When** die Meldung gespeichert wird, **Then** wird sie als anonym markiert und keine personenbezogenen Daten gespeichert

---

### User Story 2 - Meldung auf Karte und Liste einsehen (Priority: P2)

Ein Bürger möchte prüfen, ob ein Mangel in seiner Straße bereits gemeldet wurde. Er öffnet die Übersichtsseite und sieht alle öffentlichen Meldungen auf einer interaktiven Karte sowie in einer Listenansicht.

**Why this priority**: Verhindert Doppelmeldungen, schafft Transparenz und stärkt das Vertrauen der Bürger in die Plattform.

**Independent Test**: Karte und Liste zeigen vorhandene Meldungen korrekt, auch ohne eigene Meldung.

**Acceptance Scenarios**:

1. **Given** mehrere öffentliche Meldungen im System, **When** ein Nutzer die Übersichtsseite öffnet, **Then** sieht er alle Meldungen als Marker auf der Karte und in der Liste
2. **Given** ein Nutzer klickt einen Marker an, **When** die Detailansicht öffnet, **Then** sieht er Kategorie, Beschreibung, Status, Datum und ggf. Foto
3. **Given** viele Meldungen in einem Bereich, **When** die Karte angezeigt wird, **Then** werden nahe Marker zu Clustern zusammengefasst

---

### User Story 3 - Mitarbeiter bearbeitet Meldung (Priority: P3)

Ein Mitarbeiter der Stadtverwaltung loggt sich ins interne Dashboard ein, sieht alle eingegangenen Meldungen, filtert nach Kategorie und Status, öffnet eine Meldung, weist sie einer Abteilung zu, setzt die Priorität und ändert den Status auf "In Bearbeitung".

**Why this priority**: Ohne Bearbeitungsmöglichkeit bleibt die Plattform einseitig. Das Dashboard macht die Plattform für die Verwaltung nutzbar.

**Independent Test**: Ein Mitarbeiter kann sich einloggen, eine Meldung öffnen und den Status ändern.

**Acceptance Scenarios**:

1. **Given** ein eingeloggter Mitarbeiter, **When** er das Dashboard öffnet, **Then** sieht er alle Meldungen in einer Tabelle mit Filterung nach Kategorie, Status und Datum
2. **Given** ein Mitarbeiter öffnet eine Meldung, **When** er den Status ändert, **Then** wird ein Zeitleisten-Eintrag erstellt und (wenn E-Mail hinterlegt) der Bürger benachrichtigt
3. **Given** ein Mitarbeiter ändert den Status auf "Gelöst", **When** der Bürger eine E-Mail-Adresse hinterlegt hat, **Then** erhält der Bürger eine automatische Benachrichtigung

---

### User Story 4 - Bürger-Konto und Statusverfolgung (Priority: P4)

Ein Bürger registriert sich mit E-Mail und Passwort, loggt sich ein und sieht in "Meine Meldungen" alle seine bisherigen Meldungen mit Statusverlauf. Er aktiviert E-Mail-Benachrichtigungen für Statusänderungen.

**Why this priority**: Erhöht die Nutzerbindung und Transparenz, ist aber kein Kernfeature (Verfolgung per Ticket-ID möglich).

**Independent Test**: Registrierung, Login und Übersicht der eigenen Meldungen funktionieren unabhängig.

**Acceptance Scenarios**:

1. **Given** ein nicht registrierter Nutzer, **When** er sich mit E-Mail + Passwort registriert, **Then** erhält er eine Bestätigungs-E-Mail und kann sich danach einloggen
2. **Given** ein eingeloggter Bürger, **When** er "Meine Meldungen" aufruft, **Then** sieht er alle seine Meldungen mit Status-Timeline
3. **Given** ein Bürger hat E-Mail-Benachrichtigungen aktiviert, **When** der Status einer seiner Meldungen sich ändert, **Then** erhält er automatisch eine E-Mail

---

### User Story 5 - Admin verwaltet Kategorien und Konfiguration (Priority: P5)

Ein Administrator legt eine neue Mängelkategorie an, verwaltet Nutzerzugänge für Mitarbeiter und passt das Theming (Stadtname, Logo, Primärfarbe) an.

**Why this priority**: Notwendig für den Betrieb, aber nicht für den initialen MVP der Bürgerfunktionen.

**Independent Test**: Admin-UI unabhängig vom Rest der Plattform testbar.

**Acceptance Scenarios**:

1. **Given** ein Admin-Benutzer, **When** er eine neue Kategorie anlegt, **Then** erscheint sie sofort im Meldeformular für Bürger
2. **Given** ein Admin, **When** er Stadtname und Logo ändert, **Then** erscheint das neue Branding auf der gesamten Plattform ohne Code-Änderung

---

### Edge Cases

- Was passiert, wenn ein Bürger ein Foto hochlädt, das zu groß ist (>10 MB)?
- Wie verhält sich das System, wenn ein Nutzer einen Standort außerhalb des Stadtgebiets angibt?
- Was passiert, wenn der GPS-Dienst auf dem Gerät nicht verfügbar ist?
- Wie wird mit Meldungen umgegangen, die identisch mit einer bereits offenen Meldung sind (Duplikat)?
- Was passiert, wenn ein Mitarbeiter-Konto deaktiviert wird, dem aktive Meldungen zugewiesen sind?
- Wie verhält sich die Karte bei mehr als 1000 gleichzeitig angezeigten Meldungen?

## Requirements *(mandatory)*

### Functional Requirements

**Meldeformular (Bürger)**
- **FR-001**: Das System MUSS anonyme Meldungen ohne Registrierung ermöglichen
- **FR-002**: Das Meldeformular MUSS als Schritt-für-Schritt-Wizard (max. 4 Schritte) gestaltet sein
- **FR-003**: Bürger MÜSSEN eine Kategorie aus einer konfigurierbaren Liste auswählen können (Pflichtfeld)
- **FR-004**: Bürger MÜSSEN den Standort über eine interaktive Karte oder Adresseingabe angeben können (Pflichtfeld)
- **FR-005**: Das System MUSS GPS-Unterstützung auf Mobilgeräten anbieten
- **FR-006**: Bürger MÜSSEN bis zu 3 Fotos hochladen können (optional)
- **FR-007**: Das System MUSS vor dem Absenden eine Zusammenfassung aller Eingaben anzeigen
- **FR-008**: Nach dem Absenden MUSS das System eine einzigartige Ticket-ID generieren und anzeigen
- **FR-009**: Das System MUSS bei ähnlichen Meldungen in der Nähe einen Hinweis auf mögliche Duplikate anzeigen

**Öffentliche Übersicht**
- **FR-010**: Das System MUSS alle öffentlichen Meldungen auf einer interaktiven Karte als Marker anzeigen
- **FR-011**: Nahe Marker MÜSSEN bei kleinen Zoomstufen zu Clustern zusammengefasst werden
- **FR-012**: Das System MUSS eine Listenansicht mit Filterung nach Kategorie, Status und Datum bereitstellen
- **FR-013**: Jede Meldung MUSS eine Detailansicht mit Kategorie, Beschreibung, Status, Datum und ggf. Foto haben
- **FR-014**: Das System MUSS eine Adress- und Schlagwortsuche anbieten

**Bürger-Konto**
- **FR-015**: Bürger MÜSSEN sich mit E-Mail und Passwort registrieren können
- **FR-016**: Das System MUSS Login, Logout und Passwort-Zurücksetzen unterstützen
- **FR-017**: Eingeloggte Bürger MÜSSEN ihre eigenen Meldungen mit Status-Timeline einsehen können
- **FR-018**: Bürger MÜSSEN E-Mail-Benachrichtigungen bei Statusänderungen aktivieren können (opt-in)

**Internes Dashboard (Verwaltung)**
- **FR-019**: Mitarbeiter MÜSSEN sich über einen separaten Bereich einloggen können
- **FR-020**: Das Dashboard MUSS alle Meldungen in einer filterbaren und sortierbaren Tabelle anzeigen
- **FR-021**: Mitarbeiter MÜSSEN Meldungen kategorisieren, priorisieren und Ämtern/Personen zuweisen können
- **FR-022**: Das System MUSS einen Status-Workflow unterstützen: Neu → In Bearbeitung → Gelöst / Abgelehnt / Rückfrage
- **FR-023**: Jeder Statuswechsel MUSS einen Zeitleisten-Eintrag mit Timestamp erzeugen
- **FR-024**: Mitarbeiter MÜSSEN interne Kommentare (nicht öffentlich) zu Meldungen schreiben können
- **FR-025**: Das System MUSS Massenbearbeitung mehrerer Meldungen ermöglichen
- **FR-026**: Das System MUSS ein KPI-Dashboard mit Statistiken nach Kategorie, Status und Bearbeitungszeit anbieten
- **FR-027**: Das System MUSS CSV/Excel-Export für Meldungen bereitstellen

**Admin-Bereich**
- **FR-028**: Admins MÜSSEN Kategorien (Icon, Name, Amt, Bearbeitungsziel in Tagen) verwalten können
- **FR-029**: Admins MÜSSEN Mitarbeiter-Konten anlegen und Rollen vergeben können
- **FR-030**: Admins MÜSSEN E-Mail-Vorlagen verwalten können
- **FR-031**: Admins MÜSSEN Theming (Stadtname, Logo, Primärfarbe) über die UI konfigurieren können

### Key Entities

- **Meldung (Report)**: Kernobjekt mit Kategorie, Standort (lat/lng + Adresse), Beschreibung, Fotos, Status, Priorität, Melder-Infos, Zuweisungen und Statusverlauf
- **Kategorie**: Konfigurierbare Einheit mit Icon, Name, zuständigem Amt und Bearbeitungsziel in Tagen
- **Mitarbeiter (StaffUser)**: Interner Nutzer mit Rolle (STAFF oder ADMIN) und Abteilung
- **Bürger (Citizen)**: Optionaler registrierter Nutzer mit eigenen Meldungen und Benachrichtigungs-Einstellungen
- **Foto**: Anhang einer Meldung mit URL-Referenz
- **Interner Kommentar**: Nicht-öffentliche Notiz eines Mitarbeiters zu einer Meldung
- **Statuseintrag**: Protokoll jedes Statuswechsels mit Timestamp, Autor und optionaler Notiz

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bürger können eine Meldung in unter 3 Minuten abschließen (von Seitenaufruf bis Ticket-ID)
- **SC-002**: Die Plattform lädt auf einem Mobilgerät im 4G-Netz in unter 3 Sekunden initial
- **SC-003**: Alle Seiten bestehen den automatisierten Accessibility-Check ohne kritische Fehler (WCAG 2.1 AA)
- **SC-004**: Mitarbeiter können den Status einer Meldung in unter 30 Sekunden ändern
- **SC-005**: Die Karte zeigt bis zu 1000 Meldungen ohne spürbare Verlangsamung der Interaktion
- **SC-006**: 100% der Statuswechsel erzeugen einen Zeitleisten-Eintrag
- **SC-007**: E-Mail-Benachrichtigungen werden nach einem Statuswechsel in unter 5 Minuten zugestellt
- **SC-008**: Admin kann eine neue Kategorie anlegen, die sofort im Meldeformular erscheint

## Assumptions

- Der Betrieb erfolgt in Deutschland; Hauptsprache ist Deutsch; i18n-Struktur für spätere Erweiterung vorbereitet
- Fotos werden serverseitig gespeichert (lokal oder S3-kompatibel); keine clientseitige Verarbeitung
- E-Mail-Versand über einen externen SMTP-Dienst (konfigurierbar per ENV)
- OpenStreetMap und Leaflet werden kostenfrei ohne API-Key genutzt
- Kein Single-Sign-On (SSO) in der ersten Version; einfache E-Mail/Passwort-Authentifizierung
- Die Plattform ist für den Betrieb durch eine einzelne Stadt ausgelegt (kein Multi-Tenant in v1)

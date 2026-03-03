# Git-Zugang für PDAcademy

## Sind Zugangsdaten nötig?

- **Commit** (lokal): Du brauchst **keine** GitHub-Zugangsdaten. Nur deine Git-Identität (Name + E-Mail) für die Commit-Autorenangabe.
- **Push** (Hochladen zu GitHub): Dafür ist eine **Authentifizierung** nötig.

## Einmalige Einrichtung

### 1. Git-Identität (für Commits)

Falls noch nicht geschehen, einmalig ausführen:

```bash
git config --global user.name "Dein Name"
git config --global user.email "deine-email@beispiel.de"
```

(E-Mail sollte mit deinem GitHub-Account übereinstimmen.)

### 2. Zugang zu GitHub (für Push)

Damit `git push` ohne ständige Abfrage funktioniert, hast du zwei Möglichkeiten:

#### Option A: HTTPS + Zugangsdaten speichern (empfohlen)

- **Credential Helper** ist unter macOS oft schon aktiv (Keychain).
- Beim **ersten** `git push` fragt Git nach Benutzername und Passwort.
  - **Passwort:** Hier **kein** GitHub-Login-Passwort verwenden, sondern ein **Personal Access Token (PAT)**.
- So erstellst du ein PAT:
  1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
  2. **Generate new token** → z.B. Name „PDAcademy“, Haken bei **repo**
  3. Token kopieren und beim ersten `git push` als Passwort eingeben
- Danach speichert macOS die Zugangsdaten in der Keychain – weitere Pushes laufen ohne erneute Eingabe.

#### Option B: SSH-Schlüssel

- SSH-Key erzeugen (falls noch keiner existiert): `ssh-keygen -t ed25519 -C "deine-email@beispiel.de"`
- Öffentlichen Schlüssel zu GitHub hinzufügen: **GitHub → Settings → SSH and GPG keys → New SSH key**
- Remote auf SSH umstellen:
  ```bash
  git remote set-url origin git@github.com:superflyer82/academy.git
  ```
- Danach reicht dein SSH-Key für Push/Pull – keine Passwort-Eingabe nötig.

## Credential Helper prüfen / setzen

Damit HTTPS-Zugangsdaten gespeichert werden:

```bash
git config --global credential.helper osxkeychain
```

(Bereits gesetzt, wenn du die Anleitung oben befolgst.)

## Normale Nutzung

```bash
git add .
git commit -m "Deine Nachricht"
git push origin main
```

Beim ersten Push mit HTTPS: Benutzername (z.B. `superflyer82`) und **Personal Access Token** als Passwort eingeben – danach merkt sich die Keychain die Daten.

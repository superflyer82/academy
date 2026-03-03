# Deployment nach academy.newlink.de

Repository: **git@github.com:superflyer82/academy.git**

---

## Deploy per Git (GitHub Actions)

Bei **Push auf den Branch `main`** baut GitHub Actions die Next.js-App und lädt sie per SFTP auf academy.newlink.de hoch.

### GitHub Secrets anlegen

1. Repo öffnen: https://github.com/superflyer82/academy  
2. **Settings** → **Secrets and variables** → **Actions**  
3. **New repository secret** anlegen:

| Secret | Wert | Pflicht |
|--------|------|--------|
| `SFTP_HOST` | academy.newlink.de | ✅ |
| `SFTP_USERNAME` | dein SFTP-Benutzername | ✅ |
| `SFTP_PASSWORD` | dein SFTP-Passwort | ✅ |
| `SFTP_PORT` | 22 | optional (Standard: 22) |
| `SFTP_REMOTE_PATH` | /pdacademy | optional (Standard: /pdacademy) |

Nach dem nächsten **Push auf `main`** läuft der Workflow automatisch und stellt die App unter https://academy.newlink.de/pdacademy/ bereit.

---

## Lokaler Deploy (SFTP)

Die Web-App kann lokal per **SFTP** hochgeladen werden. Zugangsdaten bleiben **lokal** und werden **nicht** nach GitHub gepusht.

### Wo du deine Zugangsdaten einträgst

### Schritt 1: Passwortdatei anlegen

1. **Kopiere** die Vorlage in eine neue Datei (die nur auf deinem Rechner existiert):

   ```bash
   cp sftp-credentials.academy.newlink.de.example.json sftp-credentials.academy.newlink.de.json
   ```

2. **Öffne** `sftp-credentials.academy.newlink.de.json` und ersetze die Platzhalter:

   - **DEIN_BENUTZERNAME** → dein SFTP-/FTP-Benutzername vom Hoster  
   - **DEIN_PASSWORT** → dein SFTP-Passwort  
   - **remotePath** → bei Bedarf anpassen (z.B. `/public_html` oder der Pfad, den dein Hoster angibt)

### Schritt 2: Fertig

- Die Datei **`sftp-credentials.academy.newlink.de.json`** steht in der `.gitignore`.  
- Git wird sie **nie** mit ins Repository aufnehmen und **nicht** nach GitHub pushen.  
- Deine Zugangsdaten bleiben nur lokal auf deinem Rechner.

---

## Verwendung der Zugangsdaten

- **Cursor/VS Code mit SFTP-Erweiterung:**  
  Du kannst dieselben Werte (Host, Port, Benutzer, Passwort, `remotePath`) in `.vscode/sftp.json` eintragen – diese Datei ist ebenfalls in `.gitignore` und wird nicht gepusht.

- **Eigene Skripte/Deploy-Tools:**  
  Diese können `sftp-credentials.academy.newlink.de.json` lesen (lokal), um Uploads auszuführen. Die Datei nicht ins Repo legen und nicht in öffentliche Bereiche kopieren.

---

## Kurzüberblick

| Datei | In Git? | Zweck |
|-------|--------|--------|
| `sftp-credentials.academy.newlink.de.example.json` | ✅ Ja | Vorlage ohne echte Daten |
| `sftp-credentials.academy.newlink.de.json` | ❌ Nein | **Hier** deine echten Zugangsdaten eintragen (nur lokal) |

Wenn du `sftp-credentials.academy.newlink.de.json` noch nicht angelegt hast, erscheint sie nicht in Git – das ist gewollt. Nach dem Anlegen und Ausfüllen nutzt du sie nur lokal für SFTP-Uploads.

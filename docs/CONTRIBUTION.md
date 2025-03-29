# Contribution

Um am Projekt mitzuarbeiten, solltest du deine Entwicklungsumgebung entsprechend einrichten. Hier sind die empfohlenen Schritte:

## IDE (Integrated Development Environment)
- **Empfohlene IDE**: Visual Studio Code (VSCode) [1]
  - Leichtgewichtig, erweiterbar und weit verbreitet.
  - Git integration und native Javascript Unterstützung

## Software-Entwicklungstools
- **Docker**: Wird verwendet, um die CouchDB-Datenbank und Webservice lokal zu betreiben. [2]
  - Installation: [3]
  - Stelle sicher, dass Docker Compose installiert ist. [5]

- **Git**: Für Versionskontrolle und Zusammenarbeit.
  - Installation: [4] oder Linux Package Manger.
  - Konfiguriere deinen Git-Client mit `git config --global user.name` und `git config --global user.email`.

- **Node.js und npm (Optional)**: Nur erforderlich auf Windows
    - Installation: [8] oder via Linux Package Manger

## Deployment

Erstelle eine `.env`-Datei im Root-Verzeichnis des Projektes mit folgendem Inhalt:

```bash
COUCHDB_USER=user
COUCHDB_PASSWORD=password
```

Ersetze die Platzhalter durch deine tatsächlichen Werte. Die `.env`-Datei wird in der `docker-compose`-Datei verwendet, um die Umgebungsvariablen für CouchDB zu setzen. Die Datenbank kann durch das docker-compose-File gestartet werden:

### Linux
```bash
docker compose up couchdb -d
npm run dev
```

### Windows
```bash
docker-compose .\compose-windows.yaml up -d
npm run dev
```

Der Webserver läuft auf Port `8081`.

Die Datenbank wird durch die `docker-compose`-Datei initialisiert. Das `docker-compose`-File erstellt eine Datenbank namens `shopping-list`.

Damit die Datenbank in der Web-App verwendet werden kann, müssen CORS aktiviert werden. Dafür sorgt die Datei `local.ini`.

Am Ende kann die Datenbank in der Web-App genutzt werden. Der URL `https://127.0.0.1:5984/shopping-list` kann in der Web-App unter *Einstellungen* zum Synchronisieren angegeben werden.

### Testing

Wir benutzen zum E2E Testing und Component Testing das framework Cypress[9].

Cypress kann man mit diesem Command öffnen:

```bash
npm run cy:open
```

Guide zum schreiben von E2E Tests findet ihr hier: [10]

## Git Contribution Guidelines

Um eine konsistente und effiziente Zusammenarbeit über Git zu gewährleisten, halte dich bitte an die folgenden Richtlinien:

### 1. Branching-Strategie
- **Main Branch**: Der `main`-Branch enthält immer eine stabile, lauffähige Version des Projekts. Direkte Commits auf `main` sind nicht erlaubt (Außer Projektmanagement).
- **Feature Branches**: Für neue Features oder Bugfixes erstelle einen neuen Branch vom `main`:
  ```bash
  git checkout main
  git pull
  git checkout -b <kürzel>/<feature-name>
  ```
  - Beispiel: `FD/add-user-authentication`
  - Beispiel: `MF/fix-cors-config`
- Halte Branches klein und fokussiert auf eine spezifische Aufgabe.

### 2. Commit-Richtlinien

Halte dich bei den Commit bitte an Conventional Commits [6].

- Verwende ein Präfix, um den Zweck des Commits zu kennzeichnen:
  - `feat:` für neue Features
  - `fix:` für Bugfixes
  - `docs:` für Dokumentationsänderungen
  - `refactor:` für Code-Verbesserungen ohne Funktionsänderung
  - Beispiel: `feat: Implement shopping list sync endpoint`
- Schreibe klare, aussagekräftige Commit-Nachrichten im Imperativ:
  - Gut: `Add CORS support to CouchDB config`
  - Schlecht: `Added some stuff`
- Halte Commits klein und logisch zusammengehörig.

### 3. Pull Requests (PRs)
- Sobald dein Feature oder Fix fertig ist, erstelle einen Pull Request gegen den `main`-Branch:
  ```bash
  git push origin <kürzel>/<feature-name>
  ```
- **PR-Titel**: Sollte kurz und prägnant sein, z. B. `Add shopping list sync functionality`.
- **PR-Beschreibung**: Beschreibe, was geändert wurde, warum und wie es getestet wurde. Füge bei Bedarf Screenshots oder Logs hinzu.
- Warte auf mindestens eine Code-Review-Zustimmung, bevor du den PR mergst.
- Lösche den Branch nach dem Merge, um das Repository sauber zu halten:
  ```bash
  git push origin --delete <kuerzel>/<feature-name>
  ```

### 4. Code-Qualität
- Stelle sicher, dass der Code formatiert ist (z. B. mit Prettier) und keine Linting-Fehler enthält (z. B. mit ESLint).
- Teste deinen Code lokal mit `npm start` und überprüfe, ob die Datenbankverbindung funktioniert.
- Füge Bedarf Unit-Tests hinzu.

### 5. Konfliktlösung

WARNUNG: Wenn du nicht weißt, was du tust, melde dich bei beim Technical Architect (FD) oder beim Project Manager (MF).

- Wenn Konflikte auftreten, löse sie lokal [7]:
  ```bash
  git fetch
  git rebase origin/main
  ```
- Nach dem Rebase musst du möglicherweise Änderungen pushen:
  ```bash
  git push --force
  ```

# Resources

[1] - https://code.visualstudio.com/; 29.03.2025

[2] - https://www.docker.com/; 29.03.2025

[3] - https://docs.docker.com/engine/install/ ; 29.03.2025

[4] - https://git-scm.com/; 29.03.2025

[5] - https://docs.docker.com/compose/install/linux/; 29.03.2025

[6] - https://www.conventionalcommits.org/en/v1.0.0/; 29.03.2025

[7] - https://git-scm.com/book/de/v2/Git-Branching-Rebasing; 29.03.2025

[8] - https://nodejs.org/en/download; 29.03.2025

[9] - https://docs.cypress.io/app/get-started/install-cypress; 29.03.2025

[10] - https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test; 29.03.2025
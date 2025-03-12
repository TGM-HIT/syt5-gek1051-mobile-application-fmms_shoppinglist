# Constributing

## Development
Erstelle eine `.env` Datei im Root-Verzeichnis des Projektes mit folgendem Inhalt:

```bash
COUCHDB_USER=user
COUCHDB_PASSWORD=password
```
Ersetze die Platzhalter durch deine tatsächlichen Werte.
Die `.env` wird im docker-compose Date verwendet um die Umgebungsvariablen für CouchDB zu setzen.
Die Datenbank kann durch das docker-compose file gestartet werden:

Linux:
```bash
docker compose up --watch
```

Windows:
```bash
docker-compose -f .\compose-windows.yaml up -d
npm start
```
Der Web-server läuft auf dem Port 8081.

Die Datenbank wird durch die docker-compose-Datei initialisiert.
Das docker-compose erstellt eine Datenbank namens `shopping-list`.

Damit die Datenbank in der Web-App verwendet werden kann,
müssen CORS aktiviert werden. Dafür sorgt die Datei `local.ini`.

Am Schluss kann die Datenbank in der Web-App verwendet werden.
Der URL `https://127.0.0.1:5984/shopping-list` kann in der Web-App unter Einstellungen zum synchonisieren angegeben werden.

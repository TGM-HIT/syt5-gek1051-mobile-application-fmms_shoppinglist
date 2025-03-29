# Technische Dokumentation - FMMS

## Einleitung
Diese Dokumentation beschreibt die technische Grundlage des ShoppingListe-FMMS Projekts.
Ziel ist es, einen Überblick über den verwendeten Technologie-Stack zu geben.

Die folgenden Abschnitte bieten detaillierte Einblicke in die getroffenen Entscheidungen.

### Tech Stack
- Vuejs 3 *[1]*
- CouchDB *[2]* / PouchDB *[3]*
- Docker [11]
- Karma & Vue Test Utils [9][10]

## Web Framework
Nach sorgfältiger Evaluierung haben wir uns entschieden, den bestehenden Technologie-Stack größtenteils beizubehalten,
jedoch mit einer bedeutenden Änderung im Bereich des Web-Frameworks. Ursprünglich wurde **VueJS 2** eingesetzt, das Team hat jedoch beschlossen, auf **VueJS 3** umzusteigen. 
Dieser Wechsel bringt zahlreiche Vorteile mit sich *[4], [5]*:

 - verbesserte Performance
 - moderne Features
 - eine bessere langfristige Unterstützung durch die Vue-Community

Im Rahmen dieses Projekts wird daher die Vue-Version aktualisiert.

## Datenbank
Im Bereich der Datenbanken bleiben wir bei der bewährten Kombination aus **PouchDB** und **CouchDB**.
Diese Technologien haben sich als stabil und gut geeignet für die Anforderungen des Projekts erwiesen,
insbesondere durch ihre Fähigkeit zur Offline-Synchronisation und flexiblen Datenverwaltung.
Da sie weiterhin den Bedürfnissen des Systems entsprechen, sehen wir derzeit keinen Anlass, hier Änderungen vorzunehmen. *[6], [7]*

### Datenbankeinträge

**ShoppingList - Einkaufsliste:**

| Feld          | Typ            | Beschreibung                                                                 |
|---------------|----------------|------------------------------------------------------------------------------|
| `_id`         | `String`       | Eindeutige Identifikationsnummer der Einkaufsliste (z. B. UUID oder MongoDB-ID). |
| `type`        | `String`       | Typ des Objekts, festgelegt auf `"list"`, um es als Einkaufsliste zu kennzeichnen. |
| `version`     | `Number`       | Versionsnummer der Einkaufsliste (z. B. für Schema-Updates, hier fest `1`).  |
| `title`       | `String`       | Titel oder Name der Einkaufsliste (z. B. "Wocheneinkauf").                  |
| `checked`     | `Boolean`      | Gibt an, ob die gesamte Liste als erledigt markiert ist (Standard: `false`). |
| `place`       | `Object`       | Enthält Informationen über den Ort, der mit der Liste verknüpft ist.        |
| `place.title` | `String`       | Name des Ortes (z. B. "Supermarkt XYZ").                                   |
| `place.license` | `String \| null` | Lizenzinformationen des Ortes (z. B. für Karten-Daten), standardmäßig `null`. |
| `place.lat`   | `Number \| null` | Breitengrad (Latitude) des Ortes, standardmäßig `null`.                   |
| `place.lon`   | `Number \| null` | Längengrad (Longitude) des Ortes, standardmäßig `null`.                   |
| `place.address` | `Object`     | Adressdetails des Ortes (z. B. Straße, Stadt), standardmäßig leer.         |
| `createdAt`   | `String`       | Zeitstempel der Erstellung (z. B. ISO 8601: `"2025-03-26T12:00:00Z"`).      |
| `updatedAt`   | `String`       | Zeitstempel der letzten Aktualisierung (z. B. ISO 8601).                    |


**ShoppingList-Item - Eintrag in der ShoppingListe**

| Feld          | Typ            | Beschreibung                                                                 |
|---------------|----------------|------------------------------------------------------------------------------|
| `_id`         | `String`       | Eindeutige Identifikationsnummer des Listenelements (z. B. UUID oder MongoDB-ID). |
| `type`        | `String`       | Typ des Objekts, festgelegt auf `"item"`, um es als Listenelement zu kennzeichnen. |
| `version`     | `Number`       | Versionsnummer des Elements (z. B. für Schema-Updates, hier fest `1`).      |
| `title`       | `String`       | Name oder Beschreibung des Elements (z. B. "Milch" oder "Brot").            |
| `checked`     | `Boolean`      | Gibt an, ob das Element als erledigt markiert ist (Standard: `false`).      |
| `createdAt`   | `String`       | Zeitstempel der Erstellung (z. B. ISO 8601: `"2025-03-26T12:00:00Z"`).      |
| `updatedAt`   | `String`       | Zeitstempel der letzten Aktualisierung (z. B. ISO 8601).                    |

### Datenbanksynchronisation
Bei der Offline-Nutzung von CouchDB und PouchDB sind Synchronisationskonflikte ein zentrales Thema.
Beide Datenbanken erkennen Konflikte und speichern sie, führen jedoch keine automatische Zusammenführung durch.
Stattdessen wird eine Revision als „gewinnend“ ausgewählt, wodurch Daten überschrieben werden können. [8]

Unser Ansatz: Ein manueller Algorithmus zur Konfliktlösung soll Daten intelligent zusammenführen und Verluste vermeiden:

1. Mit PouchDB alle Konflikte herausfiltern mit 
2. Alle confliting revisionen überprüfen und mergen
3. Danach Datenbanken Synchonisieren

## Deployment
Die Bereitstellung der Anwendung erfolgt effizient und standardisiert über **Docker**.
Dies ermöglicht eine hohe Portabilität, einfache Skalierbarkeit und eine konsistente Ausführungsumgebung – unabhängig von der zugrundeliegenden Infrastruktur.
Für eine detaillierte Anleitung zum Aufsetzen und Bereitstellen der Anwendung verweisen wir auf das Dokument **[CONTRIBUTION.md](CONTRIBUTION.md)**.

## Testing
Für das Testing der Anwendung setzen wir auf eine Kombination aus Karma und den Vue Test Utils.
Diese Wahl fiel aufgrund mehrerer Faktoren: Karma ist ein bewährtes, flexibles und leistungsstarkes Test-Framework,
das sich hervorragend in Vue-Projekte integrieren lässt und wurde schon im Template verwendet.
Ergänzt durch die Vue Test Utils bietet es eine solide Grundlage,
um sowohl Unit-Tests als auch Integrationstests effektiv umzusetzen.
Die Einrichtung ist einfach und unterstützt den Entwicklungsprozess effizient.

## Resources

- [1]: https://vuejs.org/api/; 19.03.2025

- [2]: https://couchdb.apache.org/; 19.03.2025

- [3]: https://pouchdb.com/; 26.03.2025

- [4]: https://www.reddit.com/r/vuejs/comments/174h3m0/vue_2_vs_vue_3_what_are_the_major_differences_and/; 19.03.2025

- [5]: https://shiftasia.com/community/difference-between-vuejs-2-and-3-when-to-use-them/; 19.03.2025

- [6]: https://www.quora.com/What-are-the-pros-and-cons-of-CouchDB; 19.03.2025

- [7]: https://www.joshmorony.com/creating-a-multiple-user-app-with-pouchdb-couchdb/; 19.03.2025

- [8]: https://pouchdb.com/guides/conflicts.html; 26.03.2025

- [9]: https://karma-runner.github.io/6.4/index.html; 26.03.2025

- [10]: https://test-utils.vuejs.org/guide/; 26.03.2025

- [11]: https://www.docker.com/; 26.03.2025


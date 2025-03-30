# Technische Dokumentation - FMMS

## Einleitung
Diese Dokumentation beschreibt die technische Grundlage des ShoppingListe-FMMS-Projekts.
Ziel ist es, einen detaillierten Überblick über den verwendeten Technologie-Stack zu geben sowie die getroffenen Entscheidungen und deren Hintergründe zu beleuchten.
Dabei wird insbesondere auf die gewählten Technologien, Architekturentscheidungen, Deployment-Strategien sowie Testing-Ansätze eingegangen.
Diese Dokumentation beschreibt die technische Grundlage des ShoppingListe-FMMS Projekts.

### Tech Stack
Das Projekt basiert auf einem modernen, jedoch bewährten Technologie-Stack, der Performance, Skalierbarkeit und Wartbarkeit gewährleistet.

- VueJS 2 [1] - Als Frontend-Framework aufgrund der einfachen Integration und bestehender Codebasis.
- CouchDB [2] / PouchDB [3] - Flexible NoSQL-Datenbanken zur Offline-Nutzung und Synchronisation.
- Docker [11] - Containerisierung zur Vereinfachung von Deployment & Development
- Cypress (E2E & Component Testing) [12] - Automatisiertes End-to-End-Testing.

## Web Framework
Nach sorgfältiger Evaluierung haben wir uns entschieden, den bestehenden Technologie-Stack beizubehalten, einschließlich des aktuellen Web-Frameworks VueJS 2. Ursprünglich wurde ein Upgrade auf VueJS 3 in Betracht gezogen, jedoch haben mehrere Faktoren zu der Entscheidung geführt, bei VueJS 2 zu bleiben:

- Hoher Migrationsaufwand: Vue Material wird in VueJS 3 nicht mehr unterstützt, was eine aufwendige Anpassungen erforderlich machen würde.
- Fehlende Erfahrung: Im Team besteht begrenztes Wissen sowohl über VueJS 2 als auch über VueJS 3, was eine effiziente Migration erschwert.
- Knapp bemessene Deadline: Die verfügbare Zeit reicht nicht aus, um die Migration sauber durchzuführen und gleichzeitig die Projektziele zu erreichen.

Aufgrund dieser Herausforderungen wird das Projekt weiterhin auf VueJS 2 basieren.

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

Für das Testing benutzen wir Cypress [12]. Cypress ist als Testing Framework sehr anfängerfreundlich und bietet
E2E und Component Testing an. Es hat eine UI und sehr verständlichen testing Code, womit das Team gut arbeiten kann.
Eine Anleitung, wie anfängt zu testen ist im Dokument **[CONTRIBUTION.md](./CONTRIBUTION.md)**

## Resources

- [1]: https://v2.vuejs.org/; 19.03.2025

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

- [12]: https://www.cypress.io/; 29.03.2025

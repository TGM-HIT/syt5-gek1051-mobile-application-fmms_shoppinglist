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
- Cypress [12] - Automatisiertes End-to-End-Testing.

## Web Framework
Nach sorgfältiger Evaluierung haben wir uns entschieden, den bestehenden Technologie-Stack beizubehalten, einschließlich des aktuellen Web-Frameworks VueJS 2. Ursprünglich wurde ein Upgrade auf VueJS 3 in Betracht gezogen, jedoch haben mehrere Faktoren zu der Entscheidung geführt, bei VueJS 2 zu bleiben:

- Hoher Migrationsaufwand: Vue Material wird in VueJS 3 nicht mehr unterstützt, was eine aufwendige Anpassungen erforderlich machen würde.
- Fehlende Erfahrung: Im Team besteht begrenztes Wissen sowohl über VueJS 2 als auch über VueJS 3, was eine effiziente Migration erschwert.
- Knapp bemessene Deadline: Die verfügbare Zeit reicht nicht aus, um die Migration sauber durchzuführen und gleichzeitig die Projektziele zu erreichen.

Aufgrund dieser Herausforderungen wird das Projekt weiterhin auf VueJS 2 basieren.

Als Frontend-UI-Framework setzen wir auf **Vue Material** [13], das auf Basis vorgefertigter Komponenten den Entwicklungsaufwand erheblich reduziert. Diese Komponenten bieten eine konsistente und anpassbare Benutzeroberfläche, die es uns ermöglicht, die Designprinzipien von Material Design effektiv umzusetzen. Durch die Nutzung dieser vorgefertigten Bausteine können wir schneller iterieren und uns auf die spezifischen Anforderungen der Anwendung konzentrieren, anstatt jedes UI-Element von Grund auf neu zu entwickeln.

Es ist jedoch wichtig zu beachten, dass **Vue Material** mittlerweile als veraltet gilt und offiziell als **deprecated** markiert wurde. Der Hauptgrund dafür ist, dass Vue Material nur noch **Vue 2** unterstützt und nicht mit der neueren Version **Vue 3** kompatibel ist. Das bedeutet, dass künftige Updates, Verbesserungen und Sicherheitsfixes für Vue Material nicht mehr garantiert werden. Für zukünftige Projekte oder Weiterentwicklungen könnte es sinnvoll sein, auf modernere Alternativen umzusteigen, die die neueste Version von Vue unterstützen und aktiv gewartet werden.

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

#### Einträge erstellen & löschen

Beim Erstellen von **Shopping-Listen** und **List Items** werden die neuen Einträge direkt in die lokale **PouchDB** geschrieben. Diese Änderungen erfolgen zunächst lokal, was eine schnelle und reaktive Benutzererfahrung gewährleistet. Erst nachdem die Daten lokal gespeichert wurden, erfolgt die Synchronisation mit der entfernten Datenbank, wie in der [Datenbanksynchronisation](#datenbanksynchronisation) beschrieben.

Wenn eine Liste oder ein Item lokal gelöscht wird, erfolgt dies direkt in der entsprechenden Array-Struktur der Anwendung. Das Löschen wird durch Entfernen des Eintrags aus dem jeweiligen Array realisiert. Anschließend wird die Änderung durch den Synchronisationsprozess an die entfernte Datenbank weitergegeben, sodass die Löschung auch auf anderen Geräten oder Instanzen der Anwendung reflektiert wird. Dieser Prozess stellt sicher, dass alle Änderungen sowohl lokal als auch in der Cloud konsistent bleiben.

### Datenbanksynchronisation
PouchDB bietet hierfür eine elegante Lösung, indem es eine bidirektionale Synchronisation mit CouchDB ermöglicht [14]. Diese Dokumentation beschreibt das Konzept der Synchronisation und zeigt, wie Änderungen effizient verwaltet werden können.

Die Synchronisation zwischen PouchDB und CouchDB erfolgt über die `sync`-Methode, die in Echtzeit (`live: true`) oder als einmalige Abgleichsoperation genutzt werden kann. Dabei wird zwischen eingehenden (`pull`) und ausgehenden (`push`) Änderungen unterschieden.

#### Initialisierung der Synchronisation
Bevor eine Synchronisation gestartet wird, muss sichergestellt werden, dass keine vorherige Instanz aktiv ist. Anschließend wird die Verbindung zum CouchDB-Server aufgebaut:

```javascript
const db = new PouchDB('localDB');
const remoteDB = 'https://example.com/couchdb';

let syncHandler = db.sync(remoteDB, {
  live: true,
  retry: true
});
```

Hierbei sorgt `live: true` dafür, dass Änderungen kontinuierlich synchronisiert werden. `retry: true` stellt sicher, dass unterbrochene Verbindungen automatisch wiederhergestellt werden.

#### Verarbeitung eingehender Änderungen
Wenn Änderungen vom Server eintreffen, müssen sie überprüft und in der lokalen Datenbank aktualisiert werden. Dies geschieht über das `change`-Ereignis. Zunächst wird durch alle eingegangenen Dokumente iteriert:

```javascript
syncHandler.on('change', (info) => {
  info.change.docs.forEach(doc => {
    let arr = null;

    // Bestimmen, ob es sich um ein Shopping-Listenelement oder eine Liste handelt
    if (doc._id.match(/^item/)) {
      arr = this.shoppingListItems;
    } else if (doc._id.match(/^list/)) {
      arr = this.shoppingLists;
    } else {
      return; // Falls es sich um eine andere Art von Dokument handelt, wird es ignoriert
    }

    // Prüfen, ob das Dokument bereits in der Liste existiert
    let match = this.findDoc(arr, doc._id);

    if (match.doc) {
      if (doc._deleted) {
        // Falls das Dokument als gelöscht markiert ist, wird es aus der Liste entfernt
        arr.splice(match.i, 1);
      } else {
        // Falls es eine Aktualisierung ist, wird das Dokument aktualisiert
        delete doc._revisions;
        Vue.set(arr, match.i, doc);
      }
    } else {
      // Falls das Dokument neu ist und nicht gelöscht wurde, wird es hinzugefügt
      if (!doc._deleted) {
        arr.unshift(doc);
      }
    }
  });
});
```

Der Code überprüft, ob das empfangene Dokument zur Kategorie der Einkaufsliste (`list`) oder eines Einkaufslisten-Elements (`item`) gehört. Falls das Dokument einem dieser Typen zugeordnet werden kann, wird es in das entsprechende Array (`shoppingListItems` oder `shoppingLists`) eingeordnet. 

Im nächsten Schritt wird geprüft, ob das Dokument bereits in der lokalen Datenbank existiert. Falls es bereits vorhanden ist und als gelöscht (`_deleted`) markiert wurde, wird es aus der Liste entfernt. Falls es aktualisiert wurde, wird das `_revisions`-Feld entfernt, um unnötige Daten zu vermeiden, und die bestehende Version mit `Vue.set` aktualisiert. 

Sollte das Dokument neu sein und nicht gelöscht, wird es am Anfang der Liste eingefügt. Dieser Mechanismus stellt sicher, dass neu synchronisierte Daten unmittelbar in der Benutzeroberfläche erscheinen und veraltete Einträge entfernt werden.

#### Konfliktlösung

TODO: Ausarbeiten und Schreiben von Kofliktlösungsansatz, verweise auf [8]

## Deployment

Die Bereitstellung der Anwendung erfolgt effizient und standardisiert über **Docker** [11]. Durch den Einsatz von Containern wird sichergestellt, dass die Anwendung in einer isolierten Umgebung läuft, unabhängig von der zugrunde liegenden Hardware oder Software. Dies führt zu einer konsistenten Entwicklung, Testung und Produktion.

### Warum Docker?

Docker ermöglicht eine hohe Portabilität und erleichtert die Bereitstellung, da alle Abhängigkeiten in einem Container gebündelt sind. Dadurch können Probleme, die durch unterschiedliche Entwicklungs- und Produktionsumgebungen entstehen, minimiert werden. Zudem verbessert Docker die Skalierbarkeit, da mehrere Instanzen der Anwendung einfach in einer Container-Orchestrierungslösung wie Kubernetes oder Docker Swarm verwaltet werden können.

### Architektonischer Ansatz

Die Anwendung wird als Container-Image definiert, das alle benötigten Bibliotheken und Konfigurationen enthält. Dieses Image kann dann in verschiedenen Umgebungen genutzt werden. Zur Verwaltung der Container wird eine zentrale Registry verwendet, aus der das Image für die Bereitstellung abgerufen wird. Der gesamte Prozess kann in eine CI/CD-Pipeline integriert werden, sodass neue Versionen automatisch getestet und bereitgestellt werden können.

Weitere technische Details zur Bereitstellung sind in CONTRIBUTION.md zu finden.
Für eine detaillierte Anleitung zum Aufsetzen und Bereitstellen der Anwendung verweisen wir auf das Dokument **[CONTRIBUTION.md](CONTRIBUTION.md#deployment)**.

## Testing

Eine robuste Teststrategie ist entscheidend für die Wartbarkeit und Zuverlässigkeit der Anwendung. Um diesen Anforderungen gerecht zu werden, nutzen wir Cypress[12] als End-to-End (E2E)-Testing-Framework. Cypress ermöglicht es, Benutzerinteraktionen in einer realistischen Browserumgebung zu simulieren und Fehler frühzeitig zu erkennen.

### Bedeutung des E2E-Testens

E2E-Tests sind essenziell, um sicherzustellen, dass die gesamte Anwendung unter realistischen Bedingungen funktioniert. Diese Tests decken den vollständigen Benutzerfluss ab und helfen dabei, Integrationsprobleme zwischen verschiedenen Komponenten frühzeitig zu erkennen. Durch die Simulation echter Nutzerinteraktionen können kritische Fehler identifiziert werden, bevor sie in Produktion gehen.

### Teststrategie

Unsere Teststrategie konzentriert sich vollständig auf End-to-End-Tests (E2E), um sicherzustellen, dass die Anwendung in ihrer Gesamtheit korrekt funktioniert. Dabei testen wir:

- Benutzerinteraktionen mit der UI

- Navigation durch die Anwendung

_ Integration mit externen APIs oder Datenbanken

- Fehlerbehandlung und Validierungen

- E2E-Tests laufen automatisiert in der CI/CD-Pipeline, um sicherzustellen, dass jede neue Änderung getestet wird, bevor sie in Produktion geht. Dies minimiert das Risiko von Regressionen und verbessert die allgemeine Softwarequalität.

Weitere Informationen zur Implementierung von Tests befinden sich in **[CONTRIBUTION.md](./CONTRIBUTION.md#testing)**.

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

- [13]: https://www.creative-tim.com/vuematerial; 31.03.2025

- [14]: https://pouchdb.com/guides/replication.html; 31.03.2025
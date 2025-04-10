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

- Hoher Migrationsaufwand: Vue Material wird in VueJS 3 nicht mehr unterstützt, was eine aufwändige Anpassung erforderlich machen würde.
- Fehlende Erfahrung: Im Team besteht begrenztes Wissen sowohl über VueJS 2 als auch über VueJS 3, was eine effiziente Migration erschwert.
- Knapp bemessene Deadline: Die verfügbare Zeit reicht nicht aus, um die Migration sauber durchzuführen und gleichzeitig die Projektziele zu erreichen.

Aufgrund dieser Herausforderungen wird das Projekt weiterhin auf VueJS 2 basieren.

Als Frontend-UI-Framework setzen wir auf **Vue Material** [13], das auf Basis vorgefertigter Komponenten den Entwicklungsaufwand erheblich reduziert. Diese Komponenten bieten eine konsistente und anpassbare Benutzeroberfläche, die es uns ermöglicht, die Designprinzipien von Material Design effektiv umzusetzen. Durch die Nutzung dieser vorgefertigten Bausteine können wir schneller iterieren und uns auf die spezifischen Anforderungen der Anwendung konzentrieren, anstatt jedes UI-Element von Grund auf neu zu entwickeln.

Es ist jedoch wichtig zu beachten, dass **Vue Material** mittlerweile als veraltet gilt und offiziell als **deprecated** markiert wurde. Der Hauptgrund dafür ist, dass Vue Material nur noch **Vue 2** unterstützt und nicht mit der neueren Version **Vue 3** kompatibel ist. Das bedeutet, dass künftige Updates, Verbesserungen und Sicherheitsfixes für Vue Material nicht mehr garantiert werden. Für zukünftige Projekte oder Weiterentwicklungen könnte es sinnvoll sein, auf moderne Alternativen umzusteigen, die die neueste Version von Vue unterstützen und aktiv gewartet werden.

## Dokumentation der verwendeten Schnittstellen

Im Projekt wurden mehrere interne VueJS-Schnittstellen (siehe [1]), aber auch externe Schnittstellen wie zum Beispiel die Nominatim API [15] von Openstreetmap verwendet.

### VueJS-Schnittstellen

Laut dem `package.json` File, verwendet diese Applikation die Folgende Vue-Version:

```json
    "vue": "^2.7.16",
    "vue-material": "^0.7.5",
```

Das bedeutet, dass die zu verwendende API-Dokumentation die folgende ist: [16]

Ebenso wird, wie hier ersichtlich ist, das `Vue Material` Theme mit der Version `0.7.5` verwendet.

Gehen wir aber genauer darauf an, welche spezifischen Funktionalitäten wir von VueJS zwei in unserem Projekt verwenden:

[prompt-1]

#### Erstellen der App-Instanz

Der folgende Code ist dafür verantwortlich, dass die Vue-App-Instanz erstellt wird:

```javascript
var app = new Vue({
  el: '#app',
  data: { ... },
  computed: { ... },
  methods: { ... },
  created: function() { ... }
});
```

*shoppinglist.js, Zeile 104*

Hierbei ist besonders auf `el: '#app'` acht zu geben. Diese bindet die Vue-Instanz an das HTML-Element mit der ID `#app'. [17]


#### data - Reaktive Datenquelle

Das `data`-Objekt enthält alle reaktiven Daten des UI-Zustands. Also alles, was man auf dem Bildschirm sieht (Inputs, Texte, Listen, etc.) basiert auf die Werte, die hier gespeichert sind.

Ebenso sind die Werte **reaktiv**, heißt: Wenn sich hier etwas ändert, passt sich die Benutzeroberfläche automatisch an. [18]

```javascript
data: {
  mode: 'showlist',
  shoppingLists: [],
  shoppingListItems: [],
  singleList: null,
  currentListId: null,
  syncURL: '',
  syncStatus: 'notsyncing',
  selectedItem: null,
  newItemTitle: '',
  dictionary: [],
  filteredSuggestions: []
}
```

*shoppinglist.js, Zeile 106*

Zu "spüren" sind diese Werte zum Beispiel beim folgenden:
- Wenn man eine Einkaufsliste erstellt, wird diese direkt in `shoppingLists` gespeichert und damit auch sofort angezeigt
- Wenn man `mode = 'addList` konfiguriert (siehe `index.html`), zeigt Vue automatisch das Formular zum Hinzufügen an.


#### computed - Abgeleitete Daten

Folgender Code:

```javascript
computed: {
  counts: function() {
    var obj = {};
    // count #items and how many are checked
    for(var i in this.shoppingListItems) {
      var d = this.shoppingListItems[i];
      if (!obj[d.list]) {
        obj[d.list] = { total: 0, checked: 0};
      }
      obj[d.list].total++;
      if (d.checked) {
        obj[d.list].checked++;
      }
    }
    return obj;
  }
}
```

*shoppinglist.js, Zeile 125-146*

Das Stichwort `computed`: automatisch berechnete Werte, die auf dem `data`-Zustand basieren. Es wird keine eigene Logik im Template geschrieben - Vue übernimmt hier das Rechnen bzw. Auswerten der Daten. [19]

Hierbei haben wir jetzt z.B. die `counts` Methode in der `computed` Section, welche den folgenden Sinn hat:
- Alle Elemente in der jeweiligen Shoppingliste werden bei jeder Änderung gezählt. Dies inkludiert das Zählen von nicht-gecheckten, aber auch gecheckten Elementen.

#### methods - die "Butons" der App

Folgender Code:

```javascript
methods: {
    onClickSettings: function () {
        this.mode = 'settings';
    },
  
    onClickAbout: function () {
        this.mode = 'about';
    }
}
```

*shoppinglist.js, Zeile 207 - 221*

Hier werden alle Funktionen definiert, die auf Benutzerinteraktion reagieren. Zum Beispiel, wenn jemand auf einen Button klickt, einen Eintrag erstellt oder löscht. [20]

In diesem Fall haben wir zwei Methoden, welche den Modus wechseln. Damit werden dem Benutzer zum Beispiel
beim Auslösen der `onClickSettings` Methode die Einstellungen und beim auslösen der `onClickAbout` die About-Einträge angezeigt.

Beispiele aus der App:

| Methode                   | Funktion         |
|---------------------------|------------------|
| `onClickAddShoppingList`  |     Öffnet Formular für neue Liste             |
| `onClickSaveShoppingList` |        Speichert Liste lokal in PouchDB          |
| `onAddListItem`           |    Fügt neuen Artikel hinzu              |
| `onCheckListItem`         |    Aktualisiert, ob ein Artikel "erledigt" ist              |
| `onClickStartSync`        |     Startet die Synchronisierung mit CouchDB             |
| `onClickLookup`                          |    Ruft die OpenStreetMap-API auf              |
|  `onChangePlace`                         |      Trägt Ort, Straße, Stadt usw. in die Liste ein            |


#### Lifecycle Hook: created()

Folgener Code:

```javascript
created: function() {

    // create database index on 'type'
    db.createIndex({ index: { fields: ['type'] }}).then(() => {
      
      // load all 'list' items 
      var q = {
        selector: {
          type: 'list'
        }
      };
      return db.find(q);
    }).then((data) => {

      // write the data to the Vue model, and from there the web page
      app.shoppingLists = data.docs;

      // get all of the shopping list items
      var q = {
        selector: {
          type: 'item'
        }
      };
      return db.find(q);
    }).then((data) => {
      // write the shopping list items to the Vue model
      app.shoppingListItems = data.docs;

      // load settings (Cloudant sync URL)
      return db.get('_local/user');
    }).then((data) => {
      // if we have settings, start syncing
      this.syncURL = data.syncURL;
      this.startSync();
    }).catch((e) => {})

    this.loadDictionary();
  }
```

*shoppinglist.js, Zeile 169 - 206*

`created()` wird einmal aufgerufen, wenn die App startet. [20] Es ist damit ideal, um:

- Daten aus der Datenbank zu laden (Zeile 174 - 193)
- den Anfangszustand einiger Attribute festzulegen
- Konfigurationen vorzunehmen

Was passiert hier bei uns im Projekt? Folgendes:

- Vorhandene Einkaufslisten + Items werden aus der PouchDB geladen
- (falls vorhanden) Gespeicherte Sync-URL wird geladen
- (falls URL vorhanden ist) Der CouchDB-Sync wird gestartet
- Das Wörterbuch für die Auto-suggestion Funktionalität wird geladen

#### Vue Materials + Themes

Wir verwenden hier im Projekt Vue Material [21], um ein einheitliches Theme zu gewährleisten.

Dies wird im Code in der folgenden Sektion gemacht:

```javascript
import VueMaterial from 'vue-material'
...

// Vue Material plugin
Vue.use(VueMaterial);
```

*shoppinglist.js, Zeile 2 und Zeile 89*

Dies ermöglicht die Verwendung von Material Design Komponenten wie z.B.:

- `<md-button>`
- `<md-card>`
- `<md-input-container>`
- `<md-icon>`
- `<md-toolbar>`

Für genauere Informationen zu den Material Design Komponenten siehe [23].

Die Theme-Konfiguration findet nun folgendermaßen statt:

```javascript
Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'white',
  warn: 'red',
  background: 'grey'
});
```

*shoppinglist.js, Zeile 92 - 97*

Dadurch wird gewährleistet, dass wir ein einheitliches Styling über alle Komponenten verteilt haben.

- `primary` steuert z.B. die Farbe von Buttons

Diese Werte sind beliebig anpassbar.

#### Vue Directives - Verbindung zwischen Vue (Daten) und UI

Im `index.html` Files werden, so wie es standardmäßig ist, sogenannte Vue Directives [24] verwendet.

Diese ermöglichen es, in HTML Dokumenten eine Verbindung zwischen der UI (also den HTML Elementen) und der Datenverwaltung (also der Vue Applikation) herzustellen.

Im `index.html` File werden zum Großteil die folgenden Directives verwendet:


| Directive    | Funktion für App                                                                                                                |
|--------------|---------------------------------------------------------------------------------------------------------------------------------|
| `v-model`    | two-way Bindung zwischen Vue Daten (`data`) und dem Eingabefeld                                                                 |
| `v-if`       | Ermöglicht if-Verzweigungen anhand Zustände der Daten (also kann z.B. auch ganze Bereiche ausblenden)                           |
| `v-for`      | Ermöglicht for-loops (kann also z.B. wiederholt alle Elemente anzeigen, alle Items)                                             |
| `v-on:click` | Event-Listener für Clicks                                                                                                       |
| `v-bind`     | Bindet dynamische Werte an Attribute                                                                                            |
| `v-cloak`    | Verhindert "unformatierte Anzeige" bevor Vue geladen ist (zeigt den Content also immer nur erst dann her, wenn Vue geladen ist) | |

Im Code sieht das zum Beispiel folgendermaßen aus:

```html
        <!-- shopping list items -->
<md-list-item class="listitem" v-for="item in sortedShoppingListItems" :key="item._id" v-if="item.list == currentListId">

  <!-- checkbox against each item -->
  <div>
    <md-checkbox v-model="item.checked" class="md-primary" v-on:change="onCheckListItem(item._id)" :data-testid="`checkbox-${item._id}`" ></md-checkbox>
  </div>

  <!-- shopping list item title -->
  <div class="md-list-text-container">
    <span v-bind:class="{ cardchecked: item.checked}">{{ item.title }}</span>
  </div>
```

*index.html, Zeile 158 - 169*

Hier werden Directives verwendet:
  - `v-for & v-if`: Hier werden alle sortieren Items aus der ShoppingListe angezeigt, solange sie aus der `currentList` stammen
  - Danach wird die Verbindung zum `checked` (also "eingekauft") Attribut mittels `v-model` geact, wobei dann direkt auch ein `v-on:change` Eventlistener angewendet wird
  - Danach wird mittels `v-bind` der korrekte Checkbox-Status und Item Name angezeigt

### OpenStreetMap API (Nominatim)

Das Projekt verwendet ebenso die OpenStreetMap API namens Nominatim. [25]

Diese wird folgenderweise im Projekt eingebunden:

```javascript
    /**
     * Called when the Lookup button is pressed. We make an API call to 
     * OpenStreetMap passing in the user-supplied name of the place. If
     * the API returns something, the options are added to Vue's "places"
     * array and become a pull-down list of options on the front end.
     */
    onClickLookup: function() {

      // make request to the OpenStreetMap API
      var url = 'https://nominatim.openstreetmap.org/search';
      var qs = {
        format: 'json',
        addressdetails: 1, 
        namedetails: 1,
        q: this.singleList.place.title
      };
      ajax(url, qs).then((d) => {

        // add the list of places to our list
        this.places = d;

        // if there is only one item in the list
        if (d.length ==1) {
          // simulate selection of first and only item
          this.onChangePlace(d[0].place_id);
        }
      });

    }
```

Diese Funktion befindet sich im `methods` Bereich der Vue App und wird deshalb auch von einem Button ausgelöst.

Im Endeffekt wird die API dafür verwendet, um Ortsnamen, welche der Benutzer eingibt nachzuschlagen und dem Benutzer nach einem Klick auf den "Lookup" Button einen passenden Ort, welcher wirklich existiert, vorschlägt.

### CouchDB / Cloudant Sync

Wir verwenden die PouchDB Sync Funktionalität:

```javascript
/**
     * Called when the sync process is to start. Initiates a PouchDB to
     * to Cloudant two-way sync and listens to the changes coming in
     * from the Cloudant feed. We need to monitor the incoming change
     * so that the Vue.js model is kept in sync.
     */
    startSync: function() {
      this.syncStatus = 'notsyncing';
      if (this.sync) {
        this.sync.cancel();
        this.sync = null;
      }
      if (!this.syncURL) { return; }
      this.syncStatus = 'syncing';
      this.sync = db.sync(this.syncURL, {
        live: true,
        retry: false
      }).on('change', (info) => {
          // ...
      }
```

*shoppinglist.js, Zeile 250 - 267*

Hierbei wird die lokale Datenbank (`PouchDB`) mit einer externen Datenbank synchronisiert. Dies ist in unserem Use-Case z.B. die Synchronisierung
der Shoppingliste über mehrere Clients. Hierfür kann man einen PouchDB server angeben, welcher sichergeht, dass alle lokalen 
Instanzen auf dem gleichen Stand sind. [14]

Änderungen an Listen oder Items werden automatisch hochgeladen oder heruntergeladen.

Dies bedeutet, dass die Applikation auch ohne Internet funktioniert. Sie speichert nämlich alles erstmals lokal und dann, falls wieder eine Internetverbindung besteht, wird die Synchronisierung, falls die URL angegeben ist, gewagt.



## Datenbank

Im Bereich der Datenbanken bleiben wir bei der bewährten Kombination aus **PouchDB** und **CouchDB**.
Diese Technologien haben sich als stabil und gut geeignet für die Anforderungen des Projekts erwiesen,
insbesondere durch ihre Fähigkeit zur Offline-Synchronisation und flexibler Datenverwaltung.
Da sie weiterhin den Bedürfnissen des Systems entsprechen, sehen wir derzeit keinen Anlass, hier Änderungen vorzunehmen. *[6], [7]*

### Datenbankeinträge

**ShoppingList - Einkaufsliste:**

| Feld            | Typ              | Beschreibung                                                                       |
| --------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `_id`           | `String`         | Eindeutige Identifikationsnummer der Einkaufsliste (z. B. UUID oder MongoDB-ID).   |
| `type`          | `String`         | Typ des Objekts, festgelegt auf `"list"`, um es als Einkaufsliste zu kennzeichnen. |
| `version`       | `Number`         | Versionsnummer der Einkaufsliste (z. B. für Schema-Updates, hier fest `1`).        |
| `title`         | `String`         | Titel oder Name der Einkaufsliste (z. B. "Wocheneinkauf").                         |
| `checked`       | `Boolean`        | Gibt an, ob die gesamte Liste als erledigt markiert ist (Standard: `false`).       |
| `place`         | `Object`         | Enthält Informationen über den Ort, der mit der Liste verknüpft ist.               |
| `place.title`   | `String`         | Name des Ortes (z. B. "Supermarkt XYZ").                                           |
| `place.license` | `String \| null` | Lizenzinformationen des Ortes (z. B. für Karten-Daten), standardmäßig `null`.      |
| `place.lat`     | `Number \| null` | Breitengrad (Latitude) des Ortes, standardmäßig `null`.                            |
| `place.lon`     | `Number \| null` | Längengrad (Longitude) des Ortes, standardmäßig `null`.                            |
| `place.address` | `Object`         | Adressdetails des Ortes (z. B. Straße, Stadt), standardmäßig leer.                 |
| `createdAt`     | `String`         | Zeitstempel der Erstellung (z. B. ISO 8601: `"2025-03-26T12:00:00Z"`).             |
| `updatedAt`     | `String`         | Zeitstempel der letzten Aktualisierung (z. B. ISO 8601).                           |

**ShoppingList-Item - Eintrag in der ShoppingListe**

| Feld        | Typ      | Beschreibung                                                                                                                     |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------|
| `_id`       | `String` | Eindeutige Identifikationsnummer des Listenelements (z. B. UUID oder MongoDB-ID).                                                |
| `type`      | `String` | Typ des Objekts, festgelegt auf `"item"`, um es als Listenelement zu kennzeichnen.                                               |
| `version`   | `Number` | Versionsnummer des Elements (z. B. für Schema-Updates, hier fest `1`).                                                           |
| `title`     | `String` | Name oder Beschreibung des Elements (z. B. "Milch" oder "Brot").                                                                 |
| `checked`   | `Boolean` | Gibt an, ob das Element als erledigt markiert ist (Standard: `false`).                                                           |
| `quantity`  | `String` | Gibt an, wie viel der Benutzer von dem jeweiligen Produkt kaufen muss (Standard: `1`, optional)                                  |
| `unit`       | `String`  | Gibt an, in welcher Einheit der Benutzer den jeweiligen Artikel kaufen möchte (z.B. `kg`, `g`, etc.), optional (Standard: empty) |
| `createdAt` | `String` | Zeitstempel der Erstellung (z. B. ISO 8601: `"2025-03-26T12:00:00Z"`).                                                           |
| `updatedAt` | `String` | Zeitstempel der letzten Aktualisierung (z. B. ISO 8601).                                                                         |

#### Einträge erstellen & löschen

Beim Erstellen von **Shopping-Listen** und **List Items** werden die neuen Einträge direkt in die lokale **PouchDB** geschrieben. Diese Änderungen erfolgen zunächst lokal, was eine schnelle und reaktive Benutzererfahrung gewährleistet. Erst nachdem die Daten lokal gespeichert wurden, erfolgt die Synchronisation mit der entfernten Datenbank, wie in der [Datenbanksynchronisation](#datenbanksynchronisation) beschrieben.

Wenn eine Liste oder ein Item lokal gelöscht wird, erfolgt dies direkt in der entsprechenden Array-Struktur der Anwendung. Das Löschen wird durch Entfernen des Eintrags aus dem jeweiligen Array realisiert. Anschließend wird die Änderung durch den Synchronisationsprozess an die entfernte Datenbank weitergegeben, sodass die Löschung auch auf anderen Geräten oder Instanzen der Anwendung reflektiert wird. Dieser Prozess stellt sicher, dass alle Änderungen sowohl lokal als auch in der Cloud konsistent bleiben.

### Datenbanksynchronisation

PouchDB bietet hierfür eine elegante Lösung, indem es eine bidirektionale Synchronisation mit CouchDB ermöglicht [14]. Diese Dokumentation beschreibt das Konzept der Synchronisation und zeigt, wie Änderungen effizient verwaltet werden können.

Die Synchronisation zwischen PouchDB und CouchDB erfolgt über die `sync`-Methode, die in Echtzeit (`live: true`) oder als einmalige Abgleichs Operation genutzt werden kann. Dabei wird zwischen eingehenden (`pull`) und ausgehenden (`push`) Änderungen unterschieden.

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

Sollte das Dokument neu sein und nicht gelöscht werden, wird es am Anfang der Liste eingefügt. Dieser Mechanismus stellt sicher, dass neu synchronisierte Daten unmittelbar in der Benutzeroberfläche erscheinen und veraltete Einträge entfernt werden.

#### Konfliktlösung

[prompt-2]

Bei der Synchronisation zwischen mehreren Datenbanken - insbesondere bei Offline-First-Ansätzen, wie wir es hier haben, mit PouchDB  kann es zu Konflikten kommen. [8]

Diese entstehen immer dann, wenn zwei Clients dieselbe Ressource (z.B. in unserem Fall eine Einkaufsliste oder ein Item) unabhängig voneinander verändern, während sie offline sind oder bevor die Änderungen synchronisiert wurden.

PouchDB unterscheidet hierbei in zwei Arten von Konflikten: immediate und eventual Konflikte.

##### Immediate Conflicts (409 Conflict)

Sofortiger Konflikt tritt z.B. dann auf, wenn versucht wird, ein Dokument zu speichern (z.B. `db.put()`), das seit dem letzten Laden vom Server verändert wurde.

PouchDB bezeichnet diesen Fehler als `409 conflict`:

```javascript
const myDoc = {
  _id: 'someid',
  _rev: '1-somerev'
};
db.put(myDoc).then(function () {
  // success
}).catch(function (err) {
  if (err.name === 'conflict') {
    // conflict!
  } else {
    // some other error
  }
});

```

Um das hier zu verhindern, kann man eine sogenannte Upsert-Strategie verwenden (-> `update or insert`). Dazu prüft man vor dem Speichern, ob der aktuelle Datensatz in der DB existiert, lädt die aktuelle Revision und speichert dann erst die Änderung - wie in der Methode `saveLocalDoc()` in *shoppinglist.js* umgesetzt:

```javascript
    /**
     * Saves 'doc' to PouchDB. It first checks whether that doc
     * exists in the database. If it does, it overwrites it - if
     * it doesn't, it just writes it. 
     * @param {Object} doc
     * @returns {Promise}
     */
    saveLocalDoc: function(doc) {
      return db.get(doc._id).then((data) => {
        doc._rev = data._rev;
        return db.put(doc);
      }).catch((e) => {
        return db.put(doc);
      });
    }
```

Oder, wie es PouchDB direkt empfiehlt zu machen:

```javascript
function myDeltaFunction(doc) {
  doc.counter = doc.counter || 0;
  doc.counter++;
  return doc;
}

db.upsert('my_id', myDeltaFunction).then(function () {
  // success!
}).catch(function (err) {
  // error (not a 404 or 409)
});

```

*shoppinglist.js, Zeile 226 - 240*

##### Eventual Conflicts

Eventual Conflicts entstehen meist durch gleichzeitige Änderungen an derselben Ressource auf verschiedene Clients.

Wenn beide Clients offline waren und später ihre Änderungen synchronisieren, entstehen zwei konkurrierende Versionen.

CouchDB/PouchDB wählt dann automatisch eine "Gewinner-Version" nach einem festgelegten Algorithmus, verwirft die anderen aber nicht. Hierbei wird eine conflict history erhalten, auf die man auch im Nachhinein zurückgreifen kann.

Mit dem Parameter `{ conflicts: true }` beim Laden eines Dokuments kann man solche Fälle erkennen:

```javascript
db.get('list:abc123', { conflicts: true }).then((doc) => {
  if (doc._conflicts) {
    console.log('Konflikte gefunden:', doc._conflicts);
  }
});
```

Das bedeutet, dass Konflikte in dem `_conflicts` Attribut gespeichert werden.

Beispiel Objekt:

```json
{
  "_id": "list:abc123",
  "_rev": "2-a",
  "_conflicts": ["2-b"]
}
```

Hier existieren zwei konkurrierende Revisions Zweige auf gleicher Ebene (`2-a` und `2-b`), wobei einer als Gewinner markiert wurde.

(wobei das `_rev` Attribut meistens eher wie ein `2-c1592ce7b31cc26e91d2f2029c57e621` aussieht)

##### Auflösen von Konflikten

Es gibt hierbei verschiedene Strategien zur Konfliktlösung:

- **Manuelle Entscheidung des Users**: Wenn zwei Versionen in einem UI angezeigt werden und der Benutzer entscheidet.
- **Automatisch durch Regel**: z.B.: "Last Write Wins", "First Write Wins" oder benutzerdefinierte Merges.
- **Accountants don't use erasers**: Hierbei steht im Fokus, dass keine Objekte gelöscht werden. Dabei werden einfach immer wieder neue Objekte erstellt. Dadurch kann man keine existierenden Dokumente updaten oder löschen, aber auch nie einen Konflikt bekommen.

```javascript
{_id: new Date().toJSON(), change: 100} // balance increased by $100
{_id: new Date().toJSON(), change: -50} // balance decreased by $50
{_id: new Date().toJSON(), change: 200} // balance increased by $200

```

Hier werden einfach bei jeder Operation neue Objekte erstellt, anstatt auf die alten zuzugreifen.

Diese Methode geschieht (wie der Name bereits verrät) nach dem Maxim "Accountans don't use erasers". [26]

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

E2E-Tests sind essentiell, um sicherzustellen, dass die gesamte Anwendung unter realistischen Bedingungen funktioniert. Diese Tests decken den vollständigen Benutzerfluss ab und helfen dabei, Integrationsprobleme zwischen verschiedenen Komponenten frühzeitig zu erkennen. Durch die Simulation echter Nutzerinteraktionen können kritische Fehler identifiziert werden, bevor sie in Produktion gehen.

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

- [15]: https://nominatim.openstreetmap.org/ui/search.html; 01.04.2025

- [16]: https://v2.vuejs.org/v2/api/; 01.04.2025

- [17]: https://v2.vuejs.org/v2/api/#el; 01.04.2025

- [18]: https://v2.vuejs.org/v2/api/#data; 01.04.2025

- [19]: https://v2.vuejs.org/v2/api/#computed; 01.04.2025

- [20]: https://v2.vuejs.org/v2/api/#methods; 01.04.2025

- [21]: https://v2.vuejs.org/v2/api/#created; 01.04.2025

- [22]: https://www.creative-tim.com/vuematerial/; 01.04.2025

- [23]: https://www.creative-tim.com/vuematerial/components/app; 01.04.2025

- [24]: https://v2.vuejs.org/v2/api/#Directives; 01.04.2025
 
- [25]: https://nominatim.openstreetmap.org/ui/search.html; 01.04.2025

- [26]: https://queue.acm.org/detail.cfm?id=2884038; 01.04.2025

## Prompts

- [prompt-1]: 
  
  ```
  VueJS, Technical documentation. Wir haben das folgende Projekt, welches VueJS 2.7.16 verwendet: [insert code of index.html and shoppinglist.js].
  Nun möchte ich in Markdown eine Dokumentation der verwendeten Schnittstellen machen. Also der Vue-API-Schnittstellen, die das Projekt verwendet
  ```

  - 01.04.2025;ChatGPT by OpenAI; mfellner@tutanota.com


- [prompt-2]:

  ``` 
  Folgendes TechDoc:
  [insert complete TechDoc]

  Ich möchte jetzt folgenden Punkt füllen:
  "#### Konfliktlösung

    TODO: Ausarbeiten und Schreiben von Kofliktlösungsansatz, verweise auf [8]"

  Verfasse mir diesen Teil. Verwende und verweise dabei auf https://pouchdb.com/guides/conflicts.html (für text der website sehe unten)

  [insert code of shoppinglist.js]

  [insert text of website [8]]
  ```

  - 01.04.2025;ChatGPT by OpenAI; mfellner@tutanota.com
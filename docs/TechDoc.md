# Technische Dokumentation - FMMS

## Einleitung
Diese Dokumentation beschreibt die technische Grundlage des ShoppingListe-FMMS Projekts.
Ziel ist es, einen Überblick über den verwendeten Technologie-Stack zu geben.

Die folgenden Abschnitte bieten detaillierte Einblicke in die getroffenen Entscheidungen.

### Tech Stack
- Vuejs
- CouchDB/PouchDB
- Docker
- Vitest & Vue Test Utils

## Web Framework
Nach sorgfältiger Evaluierung haben wir uns entschieden, den bestehenden Technologie-Stack größtenteils beizubehalten,
jedoch mit einer bedeutenden Änderung im Bereich des Web-Frameworks. Ursprünglich wurde **VueJS 2** eingesetzt, das Team hat jedoch beschlossen, auf **VueJS 3** umzusteigen. 
Dieser Wechsel bringt zahlreiche Vorteile mit sich:

 - verbesserte Performance
 - moderne Features
 - eine bessere langfristige Unterstützung durch die Vue-Community

Im Rahmen dieses Projekts wird daher die Vue-Version aktualisiert.

## Datenbank
Im Bereich der Datenbanken bleiben wir bei der bewährten Kombination aus **PouchDB** und **CouchDB**.
Diese Technologien haben sich als stabil und gut geeignet für die Anforderungen des Projekts erwiesen,
insbesondere durch ihre Fähigkeit zur Offline-Synchronisation und flexiblen Datenverwaltung.
Da sie weiterhin den Bedürfnissen des Systems entsprechen, sehen wir derzeit keinen Anlass, hier Änderungen vorzunehmen.

### Datenbanksynchronisation
Bei der Offline-Nutzung von CouchDB und PouchDB sind Synchronisationskonflikte ein zentrales Thema.
Beide Datenbanken erkennen Konflikte und speichern sie, führen jedoch keine automatische Zusammenführung durch.
Stattdessen wird eine Revision als „gewinnend“ ausgewählt, wodurch Daten überschrieben werden können.

Unser Ansatz: Ein manueller Algorithmus zur Konfliktlösung soll Daten intelligent zusammenführen und Verluste vermeiden. Die genaue Umsetzung ist noch in Planung.

## Deployment
Die Bereitstellung der Anwendung erfolgt effizient und standardisiert über **Docker**.
Dies ermöglicht eine hohe Portabilität, einfache Skalierbarkeit und eine konsistente Ausführungsumgebung – unabhängig von der zugrundeliegenden Infrastruktur.
Für eine detaillierte Anleitung zum Aufsetzen und Bereitstellen der Anwendung verweisen wir auf das Dokument **[CONTRIBUTION.md](CONTRIBUTION.md)**.

## Testing
Für das Testing der Anwendung setzen wir auf eine Kombination aus **Vitest** und den **Vue Test Utils**.
Diese Wahl fiel aufgrund mehrerer Faktoren: Vitest ist ein modernes, leichtgewichtiges und schnelles Test-Framework,
das sich nahtlos in Vue-Projekte integrieren lässt. Ergänzt durch die Vue Test Utils bietet es eine robuste Grundlage,
um sowohl Unit-Tests als auch Integrationstests effizient zu implementieren.
Die Einrichtung ist unkompliziert, was den Entwicklungsprozess erleichtert.

# Einheit 4: Endpunkte der Bewertungsapp

Basisadresse bei lokaler Ausführung: `http://localhost:3001`

POST- und PUT-Anfragen erwarten JSON mit dem Header `Content-Type: application/json`.

## Team

| Methode | Pfad | Erwarteter Body | Erfolgreiche Rückgabe |
|---|---|---|---|
| GET | `/teams` | keiner | 200: Liste aller Teams |
| GET | `/teams/:id` | keiner | 200: einzelnes Team |
| POST | `/teams` | `name`, `klasse` | 201: angelegtes Team |
| PUT | `/teams/:id` | `name`, `klasse` | 200: aktualisiertes Team |
| DELETE | `/teams/:id` | keiner | 204: kein Antwort-Body |

`name` und `klasse` müssen nicht leere Texte sein. Ein Team mit zugeordneten Mitgliedern oder Projekten kann nicht gelöscht werden; die API antwortet mit 409.

## Project

| Methode | Pfad | Erwarteter Body | Erfolgreiche Rückgabe |
|---|---|---|---|
| GET | `/projects` | keiner | 200: Projektliste einschließlich Teams |
| GET | `/projects/:id` | keiner | 200: einzelnes Projekt einschließlich Team |
| POST | `/projects` | `teamId`, `titel`, `beschreibung`, `praesentiertAm` | 201: angelegtes Projekt |
| PUT | `/projects/:id` | `teamId`, `titel`, `beschreibung`, `praesentiertAm` | 200: aktualisiertes Projekt |
| DELETE | `/projects/:id` | keiner | 204: kein Antwort-Body |

`teamId` muss eine positive ganze Zahl sein und auf ein vorhandenes Team verweisen. `titel` und `beschreibung` müssen nicht leere Texte sein. `praesentiertAm` erwartet ein gültiges Datum im Format `JJJJ-MM-TT`.

Ein Projekt mit vorhandenen Bewertungen kann nicht gelöscht werden; die API antwortet mit 409.

## Evaluation

| Methode | Pfad | Erwarteter Body | Erfolgreiche Rückgabe |
|---|---|---|---|
| POST | `/evaluations` | `projectId`, `criterionId`, `jurorId`, `score`, `comment` | 201: angelegte Bewertung |

Alle drei IDs müssen positive ganze Zahlen sein und auf vorhandene Datensätze verweisen. `score` muss eine ganze Zahl zwischen 0 und `maxScore` des Kriteriums sein. `comment` muss ein nicht leerer Text sein.

Die Kombination aus Projekt, Kriterium und Juror muss eindeutig sein. Eine erneute Bewertung derselben Kombination wird mit 409 abgelehnt.

## Durchschnitt pro Projekt und Kriterium

| Methode | Pfad | Erwarteter Body | Erfolgreiche Rückgabe |
|---|---|---|---|
| GET | `/projects/:id/statistik` | keiner | 200: Liste mit `criterionId` und `durchschnitt` |

Die Abfrage verwendet `fn('AVG', col('score'))` und `group: ['criterionId']`. Sie berücksichtigt nur Bewertungen des angegebenen Projekts und berechnet für jedes bewertete Kriterium einen eigenen, ungewichteten Mittelwert.

Ein vorhandenes Projekt ohne Bewertungen liefert `[]`. MySQL kann den Durchschnitt als Zeichenkette zurückgeben.

## Fehlercodes

- **400:** Ungültige ID, fehlende oder ungültige Pflichtfelder, ungültiges Datum oder unzulässige Punktzahl.
- **404:** Der angefragte oder referenzierte Datensatz existiert nicht.
- **409:** Doppelte Bewertung oder Löschversuch bei bestehenden Zuordnungen.

Fehlermeldungen werden als JSON mit dem Feld `error` zurückgegeben.

## Durchgeführte Tests

- Team anlegen, abrufen, ändern und löschen.
- Einzelabruf mit ungültiger beziehungsweise nicht vorhandener Team-ID.
- Projekt anlegen, einschließlich Team abrufen und ändern.
- Testprojekt löschen: zuerst 204, beim erneuten Löschen 404.
- Bewertung speichern: 201.
- Identische Bewertung erneut senden: 409.
- Bewertung mit fehlenden Pflichtfeldern: 400.
- Bewertung mit nicht vorhandenem Projekt: 404.
- Statistik mit zwei unterschiedlichen Kriterien: getrennte Ergebnisse mit Durchschnitt 8 beziehungsweise 6.
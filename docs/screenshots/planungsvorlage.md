# Planungsvorlage: ER-Diagramm Bewertungsapp

## Beziehungsdiagramm

Die sechs Entitäten und ihre Beziehungen sind vorgegeben:

- **Team** 1:n **Member**
- **Team** 1:n **Project**
- **Project** 1:n **Evaluation**
- **Criterion** 1:n **Evaluation**
- **Juror** 1:n **Evaluation**

---

## Entitäten

### Team

| Spaltenname | Datentyp | Constraint |
| :--- | :--- | :--- |
| *id* | *INTEGER* | *Primärschlüssel, automatisch* |
| name | STRING | NOT NULL |
| klasse | STRING | NOT NULL |

#### Beispieldaten

| id | Name | Klasse |
| :- | :--- | :--- |
| 1 | Team Clovy | 4a APC |
| 2 | Team Scan2Order | 4a APC |

---

### Member

| Spaltenname | Datentyp | Constraint |
| :--- | :--- | :--- |
| *id* | *INTEGER* | *Primärschlüssel, automatisch* |
| *teamId* | *INTEGER* | *Fremdschlüssel → Team.id* |
| vorname | STRING | NOT NULL |
| nachname | STRING | NOT NULL |

#### Beispieldaten

| id | teamId | Vorname | Nachname |
| :- | :--- | :--- | :--- |
| 1 | 1 | Anna | Forstner |
| 2 | 1 | Mercedes  | Kinitz |

---

### Project

| Spaltenname | Datentyp | Constraint |
| :--- | :--- | :--- |
| *id* | *INTEGER* | *Primärschlüssel, automatisch* |
| *teamId* | *INTEGER* | *Fremdschlüssel → Team.id* |
| titel | STRING | NOT NULL |
| beschreibung | TEXT | NOT NULL |
| praesentiertAm | DATE | NOT NULL |

#### Beispieldaten

| id | teamId | Titel | Beschreibung | Präsentiert am |
| :- | :--- | :--- | :--- | :--- |
| 1 | 1 | Dezentrale Wahl-App | Abstimmungssystem auf Basis einer Blockchain | 2026-06-12 |
| 2 | 2 | Autonomer Greifarm | Robotikarm mit Bilderkennung | 2026-06-12 |

---

### Criterion

| Spaltenname | Datentyp | Constraint |
| :--- | :--- | :--- |
| *id* | *INTEGER* | *Primärschlüssel, automatisch* |
| name | STRING | NOT NULL |
| maxScore | INTEGER | NOT NULL |
| weight | FLOAT | NOT NULL |

#### Beispieldaten

| id | Name | MaxScore | Weight |
| :- | :--- | :--- | :--- |
| 1 | Inhalt | 10 | 1.0 |
| 2 | Präsentationstechnik | 10 | 1.0 |
| 3 | Technische Umsetzung | 10 | 1.5 |

---

### Juror

| Spaltenname | Datentyp | Constraint |
| :--- | :--- | :--- |
| *id* | *INTEGER* | *Primärschlüssel, automatisch* |
| name | STRING | NOT NULL |
| email | STRING | NOT NULL |

#### Beispieldaten

| id | Name | Email |
| :- | :--- | :--- |
| 1 | A. Forstner | a.forstner@schule.at |
| 2 | M. Kinitz | m.kinitz@schule.at |
| 3 | Demo | demo@schule.at |

---

### Evaluation

| Spaltenname | Datentyp | Constraint |
| :--- | :--- | :--- |
| *id* | *INTEGER* | *Primärschlüssel, automatisch* |
| *projectId* | *INTEGER* | *Fremdschlüssel → Project.id* |
| *criterionId* | *INTEGER* | *Fremdschlüssel → Criterion.id* |
| *jurorId* | *INTEGER* | *Fremdschlüssel → Juror.id* |
| score | INTEGER | NOT NULL |
| comment | TEXT | NOT NULL |

#### Unique-Constraint

Die Kombination aus `projectId`, `criterionId` und `jurorId` muss eindeutig sein:

```text
UNIQUE(projectId, criterionId, jurorId)
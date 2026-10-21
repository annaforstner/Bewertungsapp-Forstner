const express = require('express');

// Sammelt alle Routen für Projekte.
const router = express.Router();

// Lädt die Models für Projekte, Teams und Bewertungen.
const { Project, Team, Evaluation } = require('../models');

// Stellt Funktionen für SQL-Aggregationen und Spaltenverweise bereit.
const { fn, col } = require('sequelize');

// Gibt alle Projekte einschließlich ihrer Team-Daten zurück.
router.get('/', async (req, res) => {
  const projects = await Project.findAll({
    include: Team
  });

  res.json(projects);
});

// Gibt ein einzelnes Projekt einschließlich seines Teams zurück.
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Prüft, ob die Projekt-ID eine positive ganze Zahl ist.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Projekt-ID muss eine positive ganze Zahl sein'
    });
  }

  // Sucht das Projekt über seinen Primärschlüssel und lädt sein Team mit.
  const project = await Project.findByPk(id, {
    include: Team
  });

  // Meldet 404, wenn kein Projekt mit dieser ID existiert.
  if (!project) {
    return res.status(404).json({
      error: 'Projekt nicht gefunden'
    });
  }

  // Gibt das gefundene Projekt mit Status 200 als JSON zurück.
  res.json(project);
});

// Legt ein Projekt an und prüft seine Pflichtfelder und Team-Zuordnung.
router.post('/', async (req, res) => {
  const { teamId, titel, beschreibung, praesentiertAm } = req.body ?? {};

  // Die Team-ID muss im JSON als positive ganze Zahl angegeben werden.
  if (!Number.isSafeInteger(teamId) || teamId <= 0) {
    return res.status(400).json({
      error: 'teamId muss eine positive ganze Zahl sein'
    });
  }

  // Titel und Beschreibung dürfen keine leeren Texte sein.
  if (
    typeof titel !== 'string' || titel.trim() === '' ||
    typeof beschreibung !== 'string' || beschreibung.trim() === ''
  ) {
    return res.status(400).json({
      error: 'titel und beschreibung sind Pflichtfelder und müssen Text enthalten'
    });
  }

  // Erwartet ein Datum im Format JJJJ-MM-TT.
  if (
    typeof praesentiertAm !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(praesentiertAm)
  ) {
    return res.status(400).json({
      error: 'praesentiertAm muss ein Datum im Format JJJJ-MM-TT sein'
    });
  }

  // Prüft auch, ob das Datum tatsächlich existiert, z. B. kein 30. Februar.
  const datum = new Date(`${praesentiertAm}T00:00:00.000Z`);

  if (
    Number.isNaN(datum.getTime()) ||
    datum.toISOString().slice(0, 10) !== praesentiertAm
  ) {
    return res.status(400).json({
      error: 'praesentiertAm ist kein gültiges Datum'
    });
  }

  // Verhindert, dass das Projekt einem nicht vorhandenen Team zugeordnet wird.
  const team = await Team.findByPk(teamId);

  if (!team) {
    return res.status(404).json({
      error: 'Team nicht gefunden'
    });
  }

  // Speichert nur die vorgesehenen Projektfelder in der Datenbank.
  const project = await Project.create({
    teamId,
    titel: titel.trim(),
    beschreibung: beschreibung.trim(),
    praesentiertAm: datum
  });

  // Bestätigt das Anlegen mit Status 201 und gibt das Projekt zurück.
  res.status(201).json(project);
});

// Aktualisiert ein Projekt. Erwartet alle vier Projektfelder im JSON-Body.
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Prüft die Projekt-ID aus der URL.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Projekt-ID muss eine positive ganze Zahl sein'
    });
  }

  // Prüft, ob das zu ändernde Projekt existiert.
  const project = await Project.findByPk(id);

  if (!project) {
    return res.status(404).json({
      error: 'Projekt nicht gefunden'
    });
  }

  // Liest die neuen Werte aus dem JSON-Body.
  const { teamId, titel, beschreibung, praesentiertAm } = req.body ?? {};

  // Prüft die Team-ID und die beiden Textfelder.
  if (!Number.isSafeInteger(teamId) || teamId <= 0) {
    return res.status(400).json({
      error: 'teamId muss eine positive ganze Zahl sein'
    });
  }

  if (
    typeof titel !== 'string' || titel.trim() === '' ||
    typeof beschreibung !== 'string' || beschreibung.trim() === ''
  ) {
    return res.status(400).json({
      error: 'titel und beschreibung sind Pflichtfelder und müssen Text enthalten'
    });
  }

  // Erwartet das Präsentationsdatum im Format JJJJ-MM-TT.
  if (
    typeof praesentiertAm !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(praesentiertAm)
  ) {
    return res.status(400).json({
      error: 'praesentiertAm muss ein Datum im Format JJJJ-MM-TT sein'
    });
  }

  // Prüft, ob das angegebene Datum tatsächlich existiert.
  const datum = new Date(`${praesentiertAm}T00:00:00.000Z`);

  if (
    Number.isNaN(datum.getTime()) ||
    datum.toISOString().slice(0, 10) !== praesentiertAm
  ) {
    return res.status(400).json({
      error: 'praesentiertAm ist kein gültiges Datum'
    });
  }

  // Prüft, ob das ausgewählte Team existiert.
  const team = await Team.findByPk(teamId);

  if (!team) {
    return res.status(404).json({
      error: 'Team nicht gefunden'
    });
  }

  // Speichert ausschließlich die erlaubten Projektfelder.
  await project.update({
    teamId,
    titel: titel.trim(),
    beschreibung: beschreibung.trim(),
    praesentiertAm: datum
  });

  // Gibt das aktualisierte Projekt mit Status 200 zurück.
  res.json(project);
});

// Löscht ein Projekt, sofern dafür noch keine Bewertungen existieren.
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Prüft, ob die Projekt-ID eine positive ganze Zahl ist.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Projekt-ID muss eine positive ganze Zahl sein'
    });
  }

  // Sucht das Projekt in der Datenbank.
  const project = await Project.findByPk(id);

  if (!project) {
    return res.status(404).json({
      error: 'Projekt nicht gefunden'
    });
  }

  // Verhindert, dass ein bereits bewertetes Projekt gelöscht wird.
  const evaluationCount = await project.countEvaluations();

  if (evaluationCount > 0) {
    return res.status(409).json({
      error: 'Projekt kann nicht gelöscht werden, solange Bewertungen vorhanden sind'
    });
  }

  // Löscht das Projekt und bestätigt dies ohne Antwort-Body.
  await project.destroy();
  res.status(204).send();
});

// Berechnet für ein Projekt die durchschnittliche Punktzahl je Kriterium.
router.get('/:id/statistik', async (req, res) => {
  const id = Number(req.params.id);

  // Prüft die Projekt-ID aus der URL.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Projekt-ID muss eine positive ganze Zahl sein'
    });
  }

  // Unterscheidet ein fehlendes Projekt von einem Projekt ohne Bewertungen.
  const project = await Project.findByPk(id);

  if (!project) {
    return res.status(404).json({
      error: 'Projekt nicht gefunden'
    });
  }

  // Berücksichtigt nur Bewertungen dieses Projekts.
  const statistik = await Evaluation.findAll({
    where: { projectId: id },

    // AVG berechnet den Mittelwert der Punkte innerhalb jeder Gruppe.
    attributes: [
      'criterionId',
      [fn('AVG', col('score')), 'durchschnitt']
    ],

    // Jedes Kriterium erhält einen eigenen Durchschnitt.
    group: ['criterionId'],

    // Sortiert die Ergebnisse nach Kriterium und liefert einfache Objekte.
    order: [['criterionId', 'ASC']],
    raw: true
  });

  // Gibt die Durchschnittswerte zurück; ohne Bewertungen eine leere Liste.
  res.json(statistik);
});

module.exports = router;
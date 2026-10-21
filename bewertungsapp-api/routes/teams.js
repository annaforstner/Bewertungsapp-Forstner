const express = require('express');
const router = express.Router();
const { Team } = require('../models');

// Alle Teams abrufen
router.get('/', async (req, res) => {
  const teams = await Team.findAll();
  res.json(teams);
});

// Legt ein neues Team an. Name und Klasse sind Pflichtfelder.
router.post('/', async (req, res) => {
  const { name, klasse } = req.body ?? {};

  // Prüft, ob beide Felder Text enthalten und nicht leer sind.
  if (
    typeof name !== 'string' || name.trim() === '' ||
    typeof klasse !== 'string' || klasse.trim() === ''
  ) {
    return res.status(400).json({
      error: 'Name und Klasse sind Pflichtfelder und müssen Text enthalten'
    });
  }

  // Speichert das Team ohne überflüssige Leerzeichen.
  const team = await Team.create({
    name: name.trim(),
    klasse: klasse.trim()
  });

  // 201 bedeutet, dass ein neuer Datensatz angelegt wurde.
  res.status(201).json(team);
});

// Sucht ein einzelnes Team anhand der ID in der URL, z. B. /teams/1.
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Eine gültige ID muss eine positive ganze Zahl sein.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Team-ID muss eine positive ganze Zahl sein'
    });
  }

  // Sucht das Team über seinen Primärschlüssel.
  const team = await Team.findByPk(id);

  // 404 bedeutet, dass kein Team mit dieser ID existiert.
  if (!team) {
    return res.status(404).json({
      error: 'Team nicht gefunden'
    });
  }

  // Gibt das gefundene Team als JSON zurück, mit Status 200.
  res.json(team);
});

// Aktualisiert ein Team. Erwartet name und klasse im JSON-Body.
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Prüft, ob die Team-ID eine positive ganze Zahl ist.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Team-ID muss eine positive ganze Zahl sein'
    });
  }

  // Sucht das Team und meldet 404, wenn es nicht existiert.
  const team = await Team.findByPk(id);

  if (!team) {
    return res.status(404).json({
      error: 'Team nicht gefunden'
    });
  }

  // Liest und prüft die beiden Pflichtfelder.
  const { name, klasse } = req.body ?? {};

  if (
    typeof name !== 'string' || name.trim() === '' ||
    typeof klasse !== 'string' || klasse.trim() === ''
  ) {
    return res.status(400).json({
      error: 'name und klasse sind Pflichtfelder und müssen Text enthalten'
    });
  }

  // Ändert nur die erlaubten Felder und speichert sie in der Datenbank.
  await team.update({
    name: name.trim(),
    klasse: klasse.trim()
  });

  // Gibt das aktualisierte Team mit Status 200 zurück.
  res.json(team);
});

// Löscht ein Team anhand seiner ID.
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Prüft, ob die ID eine positive ganze Zahl ist.
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Die Team-ID muss eine positive ganze Zahl sein'
    });
  }

  // Sucht das Team und meldet 404, wenn es nicht existiert.
  const team = await Team.findByPk(id);

  if (!team) {
    return res.status(404).json({
      error: 'Team nicht gefunden'
    });
  }

  // Verhindert das Löschen, solange Mitglieder oder Projekte zugeordnet sind.
  const memberCount = await team.countMembers();
  const projectCount = await team.countProjects();

  if (memberCount > 0 || projectCount > 0) {
    return res.status(409).json({
      error: 'Team kann nicht gelöscht werden, solange Mitglieder oder Projekte zugeordnet sind'
    });
  }

  // Entfernt das Team aus der Datenbank.
  await team.destroy();

  // 204 bestätigt das Löschen; die Antwort enthält keinen Body.
  res.status(204).send();
});
/**
 * countMembers() und countProjects() stellt Sequelize durch eure hasMany-Beziehungen bereit.
 * 409 Conflict bedeutet hier, dass bestehende Zuordnungen das Löschen verhindern.
 */

module.exports = router;

/** router sammelt die Team-Routen. Team.
 * findAll() liest alle Teams aus der Datenbank;
 * res.json() schickt sie als JSON zurück.
 */
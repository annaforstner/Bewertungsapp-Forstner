const express = require('express');

// Sammelt die Routen für Bewertungen.
const router = express.Router();

// Lädt die Bewertung und die drei damit verbundenen Models.
const { Evaluation, Project, Criterion, Juror } = require('../models');

// Prüft und speichert eine neue Bewertung.
router.post('/', async (req, res) => {
  const { projectId, criterionId, jurorId, score, comment } = req.body ?? {};

  // Alle drei referenzierten IDs müssen positive ganze Zahlen sein.
  const ids = [projectId, criterionId, jurorId];

  if (!ids.every(id => Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({
      error: 'projectId, criterionId und jurorId müssen positive ganze Zahlen sein'
    });
  }

  // Die Punktzahl muss eine nicht negative ganze Zahl sein.
  if (!Number.isSafeInteger(score) || score < 0) {
    return res.status(400).json({
      error: 'score muss eine ganze Zahl ab 0 sein'
    });
  }

  // Der Kommentar ist laut Planungsvorlage ein Pflichtfeld.
  if (typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({
      error: 'comment ist ein Pflichtfeld und muss Text enthalten'
    });
  }

  // Prüft, ob das referenzierte Projekt existiert.
  const project = await Project.findByPk(projectId);

  if (!project) {
    return res.status(404).json({ error: 'Projekt nicht gefunden' });
  }

  // Lädt das Kriterium einschließlich seiner maximalen Punktzahl.
  const criterion = await Criterion.findByPk(criterionId);

  if (!criterion) {
    return res.status(404).json({ error: 'Kriterium nicht gefunden' });
  }

  // Prüft, ob der bewertende Juror existiert.
  const juror = await Juror.findByPk(jurorId);

  if (!juror) {
    return res.status(404).json({ error: 'Juror nicht gefunden' });
  }

  // Verhindert eine Punktzahl über dem Maximum des Kriteriums.
  if (score > criterion.maxScore) {
    return res.status(400).json({
      error: `score darf höchstens ${criterion.maxScore} sein`
    });
  }

  try {
    // Speichert die Bewertung mit den geprüften Werten.
    const evaluation = await Evaluation.create({
      projectId,
      criterionId,
      jurorId,
      score,
      comment: comment.trim()
    });

    res.status(201).json(evaluation);
  } catch (error) {
    // Der Unique-Constraint verhindert doppelte Bewertungen.
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Dieser Juror hat dieses Kriterium für dieses Projekt bereits bewertet'
      });
    }

    // Andere Fehler werden an die Express-Fehlerbehandlung weitergegeben.
    throw error;
  }
});

module.exports = router;
/** express.json() sorgt dafür, dass wir JSON-Daten aus Anfragen über req.body lesen können. */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Lädt die Team-Routen und macht sie unter /teams erreichbar.
const teamsRouter = require('./routes/teams');
app.use('/teams', teamsRouter);

// Lädt die Projekt-Routen und macht sie unter /projects erreichbar.
const projectsRouter = require('./routes/projects');
app.use('/projects', projectsRouter);

// Macht die Bewertungsroute unter /evaluations erreichbar.
const evaluationsRouter = require('./routes/evaluations');
app.use('/evaluations', evaluationsRouter);

// Verwendet zum Testen Port 3001, um einen anderen Server auf Port 3000 zu umgehen. (Port 3000 wird bereits verwendet.)
const PORT = 3001;


// Startet den Server und zeigt seine Adresse im Terminal an.
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
'use strict';

/**
 * Seeder für die Standard-Bewertungskriterien aus der Planungsvorlage.
 *
 * up(): Fügt drei Kriterien mit maximaler Punktzahl, Gewichtung
 *       und Zeitstempeln in die Tabelle Criteria ein.
 *       Die technische Umsetzung wird mit 1,5 stärker gewichtet.
 *
 * down(): Löscht alle Kriterien mit den drei angegebenen Namen.
 *
 * Achtung: Erneutes Ausführen kann doppelte Einträge erzeugen.
 */

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Criteria', [
      {
        name: 'Inhalt',
        maxScore: 10,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Präsentationstechnik',
        maxScore: 10,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Technische Umsetzung',
        maxScore: 10,
        weight: 1.5,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Criteria', {
      name: {
        [Sequelize.Op.in]: [
          'Inhalt',
          'Präsentationstechnik',
          'Technische Umsetzung'
        ]
      }
    }, {});
  }
};
'use strict';

// Exportiert die Methoden zum Einfügen und Entfernen des Testjurors.
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Legt den Testjuror mit den erforderlichen Zeitstempeln an.
    await queryInterface.bulkInsert('Jurors', [
      {
        name: 'Demo',
        email: 'demo@schule.at',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    // Entfernt alle Juroren mit dieser Test-E-Mail.
    await queryInterface.bulkDelete('Jurors', {
      email: 'demo@schule.at'
    }, {});
  }
};
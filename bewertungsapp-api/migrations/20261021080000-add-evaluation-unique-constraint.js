'use strict';
/**
 * up fügt den Constraint hinzu.
 * down entfernt ihn beim Rückgängigmachen der Migration. */

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('Evaluations', {
      fields: ['projectId', 'criterionId', 'jurorId'],
      type: 'unique',
      name: 'evaluations_project_criterion_juror_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'Evaluations',
      'evaluations_project_criterion_juror_unique'
    );
  }
};
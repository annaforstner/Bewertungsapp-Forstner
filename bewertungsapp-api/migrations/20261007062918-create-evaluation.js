'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Evaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id'
        }
      },
      criterionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Criteria',
          key: 'id'
        }
      },
      jurorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Jurors',
          key: 'id'
        }
      },
      score: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    }, {
      indexes: [
        {
          unique: true,
          fields: ['projectId', 'criterionId', 'jurorId']
        }
      ]
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Evaluations');
  }
};
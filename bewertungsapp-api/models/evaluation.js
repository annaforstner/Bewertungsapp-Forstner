'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Evaluation.belongsTo(models.Project, { foreignKey: 'projectId' });
      Evaluation.belongsTo(models.Criterion, { foreignKey: 'criterionId' });
      Evaluation.belongsTo(models.Juror, { foreignKey: 'jurorId' });
    }
  }
  Evaluation.init({
    projectId: DataTypes.INTEGER,
    criterionId: DataTypes.INTEGER,
    jurorId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    /**Als Nächstes ergänzen wir den Unique-Index.
     * Er sorgt dafür, dass derselbe Juror dasselbe Kriterium für dasselbe Projekt nur einmal bewerten kann.
     * Die Kombination der drei Felder muss eindeutig sein.
     * Ein Juror darf also weiterhin andere Projekte oder andere Kriterien bewerten. */
    sequelize,
    modelName: 'Evaluation',
    indexes: [
      {
        name: 'evaluations_project_criterion_juror_unique',
        unique: true,
        fields: ['projectId', 'criterionId', 'jurorId']
      }
    ],
  });
  return Evaluation;
};
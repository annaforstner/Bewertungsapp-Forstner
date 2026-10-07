'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.Team, {
        foreignKey: 'teamId'
      });

      Project.hasMany(models.Evaluation, {
        foreignKey: 'projectId'
      });
    }
  }
  Project.init({
    teamId: DataTypes.INTEGER,
    titel: DataTypes.STRING,
    beschreibung: DataTypes.TEXT,
    praesentiertAm: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};
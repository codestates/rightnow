'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Report_message.belongsTo(models.Message);
      models.Report_message.belongsTo(models.Users);
    }
  }
  Report_message.init(
    {
      reporter: DataTypes.STRING,
      message_id: DataTypes.INTEGER,
      report_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Report_message',
    }
  );
  return Report_message;
};

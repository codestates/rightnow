'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Report_room.belongsTo(models.Room);
      models.Report_room.belongsTo(models.User);
    }
  }
  Report_room.init(
    {
      reporter: {
        type: DataTypes.STRING,
        // references: { model: User, key: 'email' },
      },
      room_id: {
        type: DataTypes.STRING,
        // references: { model: Room, key: 'id' },
      },
      report_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Report_room',
    }
  );
  return Report_room;
};

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
      models.Report_room.belongsTo(models.Room, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Report_room.belongsTo(models.User, {
        foreignKey: 'reporter',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
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
      timestamps: false,
    }
  );
  return Report_room;
};

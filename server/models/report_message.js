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
      models.Report_message.belongsTo(models.Message, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKeyConstraint: true,
      });
      models.Report_message.belongsTo(models.User, {
        foreignKey: 'reporter',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        foreignKeyConstraint: true,
      });
    }
  }
  Report_message.init(
    {
      reporter: {
        type: DataTypes.STRING,
        // references: { model: User, key: 'email' },
      },
      message_id: {
        type: DataTypes.INTEGER,
        // references: { model: Message, key: 'id' },
      },
      report_date: { type: DataTypes.DATE, defaultValue: new Date() },
      complete: { type: DataTypes.STRING, defaultValue: 'N' },
    },
    {
      sequelize,
      modelName: 'Report_message',
      timestamps: false,
    },
  );
  return Report_message;
};

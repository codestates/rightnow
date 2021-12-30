'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Message.belongsTo(models.Room);
      models.Message.belongsTo(models.User);
      models.Message.hasMany(models.Report_message, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Message.init(
    {
      user_email: {
        type: DataTypes.STRING,
        // references: { model: User, key: 'email' },
      },
      room_id: {
        type: DataTypes.STRING,
        // references: { model: Room, key: 'id' },
      },
      content: DataTypes.STRING,
      message_type: DataTypes.STRING,
      is_update: DataTypes.STRING,
      write_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );
  return Message;
};

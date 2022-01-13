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
      models.Message.belongsTo(models.Room, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKeyConstraint: true,
      });
      models.Message.belongsTo(models.User, {
        foreignKey: 'user_email',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        foreignKeyConstraint: true,
      });
      models.Message.hasMany(models.Report_message, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        hooks: true,
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
        type: DataTypes.UUID,
        // references: { model: Room, key: 'id' },
      },
      content: DataTypes.STRING,
      message_type: { type: DataTypes.STRING, defaultValue: 'TEXT' },
      is_update: { type: DataTypes.STRING, defaultValue: 'N' },
      write_date: { type: DataTypes.DATE(6), defaultValue: new Date() },
    },
    {
      sequelize,
      modelName: 'Message',
      timestamps: false,
    },
  );
  return Message;
};

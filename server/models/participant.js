'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Participant.belongsTo(models.Room, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Participant.belongsTo(models.User, {
        foreignKey: 'user_email',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Participant.init(
    {
      user_email: {
        type: DataTypes.STRING,
        // references: { model: User, key: 'email' },
      },
      room_id: {
        type: DataTypes.STRING,
        // references: { model: Room, key: 'id' },
      },
      role: DataTypes.STRING,
      enter_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Participant',
      timestamps: false,
    }
  );
  return Participant;
};

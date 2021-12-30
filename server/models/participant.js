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
      models.Participant.belongsTo(models.Room);
      models.Participant.belongsTo(models.User);
    }
  }
  Participant.init(
    {
      user_email: DataTypes.STRING,
      room_id: DataTypes.STRING,
      role: DataTypes.STRING,
      enter_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Participant',
    }
  );
  return Participant;
};

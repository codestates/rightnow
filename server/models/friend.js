'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Friend.belongsTo(models.User, {
        foreignKey: 'req_user',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        foreignKeyConstraint: true,
      });
      models.Friend.belongsTo(models.User, {
        foreignKey: 'res_user',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        foreignKeyConstraint: true,
      });
    }
  }
  Friend.init(
    {
      req_user: DataTypes.STRING,
      res_user: DataTypes.STRING,
      is_accept: { type: DataTypes.STRING, defaultValue: 'N' },
    },
    {
      sequelize,
      modelName: 'Friend',
    },
  );
  return Friend;
};

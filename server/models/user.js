'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.User.hasMany(models.Room, {
      //   foreignKey: 'user_email',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      models.User.hasMany(models.Participant, {
        foreignKey: 'user_email',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        hooks: true,
      });
      models.User.hasMany(models.Message, {
        foreignKey: 'user_email',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        hooks: true,
      });
      models.User.hasMany(models.Report_message, {
        foreignKey: 'reporter',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        hooks: true,
      });
      // models.User.hasMany(models.Report_room, {
      //   foreignKey: 'reporter',
      //   onDelete: 'SET NULL',
      //   onUpdate: 'CASCADE',
      // });
      models.User.hasMany(models.Friend, {
        foreignKey: 'req_user',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        hooks: true,
      });
      models.User.hasMany(models.Friend, {
        foreignKey: 'res_user',
        onDelete: 'cascade',
        onUpdate: 'cascade',
        hooks: true,
      });
    }
  }
  User.init(
    {
      email: { type: DataTypes.STRING, primaryKey: true },
      password: DataTypes.STRING,
      nick_name: DataTypes.STRING,
      profile_image: DataTypes.STRING,
      role: { type: DataTypes.STRING, defaultValue: 'USER' },
      social_login: { type: DataTypes.STRING, defaultValue: 'original' },
      auth_code: { type: DataTypes.STRING, defaultValue: '' },
      is_block: DataTypes.STRING,
      block_date: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};

/*
Table reportRoom as RR{
  id int [pk,increment]
  reportor varchar
  roomId int
  reportDate datetime
}
 */

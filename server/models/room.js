'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.Room.belongsTo(models.User, {
      //   foreignKey: 'user_email',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      models.Room.belongsTo(models.Category, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKeyConstraint: true,
      });
      models.Room.hasMany(models.Message, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        hooks: true,
      });
      models.Room.hasMany(models.Participant, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        hooks: true,
      });
      // models.Room.hasMany(models.Report_room, {
      //   foreignKey: 'room_id',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
    static tommorow() {
      let tommorow = new Date();
      tommorow.setDate(tommorow.getDate() + 1);
      console.log(tommorow);
      return tommorow;
    }
  }

  Room.init(
    {
      // user_email: {
      //   type: DataTypes.STRING,
      //   // references: { model: User, key: 'email' },
      // },
      //title: DataTypes.STRING,
      //explain: DataTypes.STRING,
      //room_img: DataTypes.STRING,
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      allow_num: DataTypes.INTEGER,
      category_id: {
        type: DataTypes.INTEGER,
        // references: { model: Category, key: 'id' },
      },
      location: DataTypes.STRING,
      create_date: { type: DataTypes.DATE, defaultValue: new Date() },
      close_date: { type: DataTypes.DATE, defaultValue: Room.tommorow() },
      // notify: DataTypes.STRING,
      // lon: DataTypes.FLOAT,
      // lat: DataTypes.FLOAT,
      // is_close: { type: DataTypes.STRING, defaultValue: 'N' },
      // is_private: { type: DataTypes.STRING, defaultValue: 'N' },
      // password: DataTypes.STRING,
      // allow_range: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Room',
      timestamps: false,
    },
  );
  return Room;
};

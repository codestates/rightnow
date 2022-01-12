'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Participants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_email: {
        type: Sequelize.STRING,
        references: { model: 'Users', key: 'email' },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      room_id: {
        type: Sequelize.UUID,
        references: { model: 'Rooms', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      // role: {
      //   type: Sequelize.STRING,
      // },
      lon: {
        type: Sequelize.FLOAT,
      },
      lat: {
        type: Sequelize.FLOAT,
      },
      enter_date: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE(6),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Participants');
  },
};

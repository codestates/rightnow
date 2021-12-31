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
      },
      room_id: {
        type: Sequelize.UUID,
        references: { model: 'Rooms', key: 'id' },
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
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Participants');
  },
};

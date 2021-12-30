'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Report_rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reporter: {
        type: Sequelize.STRING,
        references: { model: 'Users', key: 'email' },
      },
      room_id: {
        type: Sequelize.STRING,
        references: { model: 'Rooms', key: 'id' },
      },
      report_date: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Report_rooms');
  },
};

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Report_messages', {
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
      message_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Messages', key: 'id' },
      },
      report_date: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Report_messages');
  },
};

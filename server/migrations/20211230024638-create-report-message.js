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
        onDelete: 'SET NULL',
        onUpdate: 'cascade',
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Messages', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'cascade',
      },
      report_date: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
      complete: {
        defaultValue: 'N',
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Report_messages');
  },
};

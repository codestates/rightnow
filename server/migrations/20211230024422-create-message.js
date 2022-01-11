'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_email: {
        type: Sequelize.STRING,
        references: { model: 'Users', key: 'email' },
        onDelete: 'NO ACTION',
        onUpdate: 'cascade',
      },
      room_id: {
        type: Sequelize.UUID,
        references: { model: 'Rooms', key: 'id' },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      content: {
        type: Sequelize.STRING,
      },
      message_type: {
        defaultValue: 'TEXT',
        type: Sequelize.STRING,
      },
      is_update: {
        defaultValue: 'N',
        type: Sequelize.STRING,
      },
      write_date: {
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Messages');
  },
};

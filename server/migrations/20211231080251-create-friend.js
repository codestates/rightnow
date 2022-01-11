'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Friends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      req_user: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'email',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      res_user: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'email',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      is_accept: {
        defaultValue: 'N',
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Friends');
  },
};

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      email: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nick_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      profile_image: {
        type: Sequelize.STRING,
      },
      role: {
        defaultValue: 'USER',
        type: Sequelize.STRING,
      },
      social_login: {
        defaultValue: 'original',
        type: Sequelize.STRING,
      },
      auth_code: {
        defaultValue: '',
        type: Sequelize.STRING,
      },
      is_block: {
        type: Sequelize.STRING,
      },
      block_date: {
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
    await queryInterface.dropTable('Users');
  },
};

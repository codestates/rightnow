'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      // user_email: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      //   references: { model: 'Users', key: 'email' },
      // },
      // title: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },
      // explain: {
      //   type: Sequelize.STRING,
      // },
      // room_img: {
      //   type: Sequelize.STRING,
      // },
      allow_num: {
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
      },
      location: {
        type: Sequelize.STRING,
      },
      // notify: {
      //   defaultValue: '',
      //   type: Sequelize.STRING,
      // },
      // lon: {
      //   type: Sequelize.FLOAT,
      // },
      // lat: {
      //   type: Sequelize.FLOAT,
      // },
      // is_close: {
      //   defaultValue: 'N',
      //   type: Sequelize.STRING,
      // },
      // is_private: {
      //   defaultValue: 'N',
      //   type: Sequelize.STRING,
      // },
      // password: {
      //   type: Sequelize.STRING,
      // },
      // allow_range: {
      //   type: Sequelize.INTEGER,
      // },
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
    await queryInterface.dropTable('Rooms');
  },
};

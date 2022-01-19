'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let bcrypt = require('bcrypt');
    let user = {
      email: 'abc@naver.com',
      password: bcrypt.hashSync('1234', 1),
      nick_name: 'park',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let user2 = {
      email: 'skatn@naver.com',
      password: bcrypt.hashSync('1234', 1),
      nick_name: 'lee',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let user3 = {
      email: 'slsl@naver.com',
      password: bcrypt.hashSync('1234', 1),
      nick_name: 'kim',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let ADMIN = {
      email: 'admin@naver.com',
      password: bcrypt.hashSync('1234', 1),
      nick_name: 'kim',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'ADMIN',
    };
    await queryInterface.bulkInsert('Users', [user, user2, user3, ADMIN], {});
    let categoryStr = ['여행', '맛집', '등산', '낚시', '기타'];
    let category = [];
    for (let name of categoryStr) {
      category.push({
        name,
        user_num: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('Categories', category, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Categories', null, {});
  },
};

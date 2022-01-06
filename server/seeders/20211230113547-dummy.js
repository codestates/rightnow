'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let user = {
      email: 'abc@naver.com',
      password: '1234',
      nick_name: 'park',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let user2 = {
      email: 'skatn@naver.com',
      password: '1234',
      nick_name: 'lee',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await queryInterface.bulkInsert('Users', [user, user2], {});
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

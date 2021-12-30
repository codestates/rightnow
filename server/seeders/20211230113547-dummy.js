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
    await queryInterface.bulkInsert('Users', [user], {});
    let categoryStr = ['여행', '맛집', '등산', '낚시', '기타'];
    let category = [];
    for (let name of categoryStr) {
      category.push({
        name,
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

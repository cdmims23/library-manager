'use strict';
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const data = fs.readFileSync('./books.csv', {encoding: 'utf-8'}).split('\n');
      let bookArr = [];

      for (let index = 1; index < data.length; index++) {
        const element = data[index].trim().split(',');
        const obj = {title: element[0], author: element[1], genre: element[2], year: element[3], createdAt: new Date(), updatedAt: new Date()}

        bookArr.push(obj);    
      }

      await queryInterface.bulkInsert('Books', bookArr, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('users',[{
    id : "cb20bc22-a616-4ab0-a998-8bbf9672471e",
    name: "Admin",
    email:"Admin@gmail.com",
    password:"$2a$12$kMBRSwx7GJKT8vwdpoiche2tXrxD8a4X9Bn/07UXTVwwnkTMcRoPi",
    role : "ADMIN"


   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

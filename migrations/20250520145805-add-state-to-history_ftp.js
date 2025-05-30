'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('history_ftp', 'state', {
      type: Sequelize.STRING,
      allowNull: true, // or false if you want to make it mandatory
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('history_ftp');
  }
};

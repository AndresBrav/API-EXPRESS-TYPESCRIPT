'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ftp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      transferMode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      host: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      local_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      remote_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_format:{
        type:Sequelize.STRING,
        allowNull:false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ftp');
  }
};

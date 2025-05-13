'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('history_ftp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name_file: {
        type: Sequelize.STRING,
        allowNull: false
      },
      uploaded: {
        type: Sequelize.DATE,
        allowNull: false
      },
      downloaded: {
        type: Sequelize.DATE,
        allowNull: false
      },
      ftp_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ftp',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
    */
    await queryInterface.dropTable('history_ftp');
  }
};

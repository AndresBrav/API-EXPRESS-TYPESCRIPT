'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailsCars', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transmision: {
        type: Sequelize.STRING,
        allowNull: false
      },
      combustible: {
        type: Sequelize.STRING,
        allowNull: false
      },
      puertas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      motor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      car_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cars',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
        unique:true // ✅ Esto impone que cada car_id sea único
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DetailsCars');
    
  }
};

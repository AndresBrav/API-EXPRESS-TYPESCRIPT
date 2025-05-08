'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('DetailsCars', [
      {
        color: 'Rojo',
        transmision: 'Manual',
        combustible: 'Nafta',
        puertas: 4,
        motor: '1.6',
        car_id: 1
      },
      {
        color: 'Azul',
        transmision: 'Automática',
        combustible: 'Nafta',
        puertas: 2,
        motor: '1.2',
        car_id: 2
      },
      {
        color: 'Negro',
        transmision: 'Manual',
        combustible: 'Diesel',
        puertas: 4,
        motor: '2.0',
        car_id: 3
      },
      {
        color: 'Blanco',
        transmision: 'Automática',
        combustible: 'Eléctrico',
        puertas: 2,
        motor: 'Eléctrico',
        car_id: 4
      },
      {
        color: 'Gris',
        transmision: 'Manual',
        combustible: 'Nafta',
        puertas: 4,
        motor: '1.8',
        car_id: 5
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('DetailsCars', null, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Cars', [
      {
        nombre: 'VW1',
        descripcion: "Auto medio",
        precio: 15000,
        stock: 10000,
        user_id: 1
      },
      {
        nombre: 'VW2',
        descripcion: "Auto chico",
        precio: 10000,
        stock: 5000,
        user_id: 1
      },
      {
        nombre: 'VW3',
        descripcion: "Auto grande",
        precio: 20000,
        stock: 20000,
        user_id: 1
      },
      {
        nombre: 'VW4',
        descripcion: "Auto chico",
        precio: 10000,
        stock: 5000,
        user_id: 1
      },
      {
        nombre: 'VW5',
        descripcion: "Auto grande",
        precio: 20000,
        stock: 20000,
        user_id: 1
      },
      {
        nombre: 'VW6',
        descripcion: "Auto chico",
        precio: 10000,
        stock: 5000,
        user_id: 1
      },
      {
        nombre: 'Audi',
        descripcion: "Auto grande",
        precio: 20000,
        stock: 20000,
        user_id: 2
      },
      {
        nombre: 'Audi',
        descripcion: "Auto chico",
        precio: 10000,
        stock: 5000,
        user_id: 2
      },
      {
        nombre: 'Audi',
        descripcion: "Auto grande",
        precio: 20000,
        stock: 20000,
        user_id: 2
      },
      {
        nombre: 'Ferrari',
        descripcion: "Auto chico",
        precio: 10000,
        stock: 5000,
        user_id: 2
      },
      {
        nombre: 'Ferrari',
        descripcion: "Auto grande",
        precio: 20000,
        stock: 20000,
        user_id: 2
      },
      {
        nombre: 'Porsche',
        descripcion: "Auto chico",
        precio: 10000,
        stock: 5000,
        user_id: 3
      },
      {
        nombre: 'Porsche',
        descripcion: "Auto grande",
        precio: 20000,
        stock: 20000,
        user_id: 3
      }
    ]);
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

'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        login: 'USER1',
        clave: bcrypt.hashSync('123', 10),
        sts: 'VIG',
        tipo: 'admin'
      },
      {
        login: 'USER2',
        clave: bcrypt.hashSync('234', 10),
        sts: 'VIG',
        tipo: 'user'
      },
      {
        login: 'USER3',
        clave: bcrypt.hashSync('345', 10),
        sts: 'VIG',
        tipo: 'admin'
      },
      {
        login: 'USER4',
        clave: bcrypt.hashSync('456', 10),
        sts: 'VIG',
        tipo: 'user'
      },
      {
        login: 'USER5',
        clave: bcrypt.hashSync('567', 10),
        sts: 'VIG',
        tipo: 'admin'
      },
      {
        login: 'USER6',
        clave: bcrypt.hashSync('678', 10),
        sts: 'VIG',
        tipo: 'user'
      },
      {
        login: 'USER7',
        clave: bcrypt.hashSync('789', 10),
        sts: 'VIG',
        tipo: 'admin'
      },
      {
        login: 'USER8',
        clave: bcrypt.hashSync('890', 10),
        sts: 'INACTIVO',
        tipo: 'user'
      },
      {
        login: 'USER9',
        clave: bcrypt.hashSync('901', 10),
        sts: 'INACTIVO',
        tipo: 'admin'
      },
      {
        login: 'USER10',
        clave: bcrypt.hashSync('012', 10),
        sts: 'INACTIVO',
        tipo: 'user'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

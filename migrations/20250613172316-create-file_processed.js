'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Filesprocessed', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_car: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            precio: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            dateupload: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Filesprocessed');
    }
};

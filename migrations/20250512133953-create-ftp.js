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
            ftp_path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            host_ip: {
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
            type_file: {
                type: Sequelize.STRING,
                allowNull: false
            },
            transfer_mode: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_format: {
                type: Sequelize.STRING,
                allowNull: false
            },
            local_directory:{
                type: Sequelize.STRING,
                allowNull:true
            },
            interpreted_directory:{
                type: Sequelize.STRING,
                allowNull:true
            },
            processed_directory:{
                type: Sequelize.STRING,
                allowNull:true
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Ftp');
    }
};

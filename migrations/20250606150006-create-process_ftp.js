'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Process_ftp', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            },
            file_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_size: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_date_creation: {
                type: Sequelize.DATE,
                allowNull: false
            },
            file_download: {
                type: Sequelize.DATE,
                allowNull: false
            },
            state: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Process_ftp');
    }
};

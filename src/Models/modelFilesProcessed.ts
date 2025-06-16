import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion';

interface DetailFileProcessedAtributtes {
    id?: number;
    id_car?: number;
    precio?: number;
    stock?: number;
    dateupload?: Date;
}

export interface DetailFileProcessedInterface
    extends Model<DetailFileProcessedAtributtes>,
        DetailFileProcessedAtributtes {}

// define crea o usa
const FilesProcessed = db.define<DetailFileProcessedInterface>(
    'FilesProcessed',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_car: {
            type: DataTypes.INTEGER
        },
        precio: {
            type: DataTypes.FLOAT
        },
        stock: {
            type: DataTypes.INTEGER // Se recomienda usar INTEGER en lugar de NUMBER
        },
        dateupload: {
            type: DataTypes.DATE
        }
    },
    {
        createdAt: false, // Para que no tenga la columna createdAt
        updatedAt: false, // Para que no tenga la columna updatedAt
        tableName: 'filesprocessed'
    }
);

export default FilesProcessed;

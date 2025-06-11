import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion';
import Car, { CarsInterface } from './modelCar';

interface DetailCarAtribbutes {
    id?: number;
    color?: string;
    transmision?: string;
    combustible?: string;
    puertas?: number;
    motor?: string;
    car_id?: number;
}

export interface DetailCarInterface extends Model<DetailCarAtribbutes>, DetailCarAtribbutes {
    Car?: CarsInterface; // Agrega la propiedad opcional si viene del include
}

// define crea o usa
const DetailCar = db.define<DetailCarInterface>(
    'DetailCar',
    {
        color: {
            type: DataTypes.STRING
        },
        transmision: {
            type: DataTypes.STRING
        },
        combustible: {
            type: DataTypes.STRING
        },
        puertas: {
            type: DataTypes.INTEGER // Se recomienda usar INTEGER en lugar de NUMBER
        },
        motor: {
            type: DataTypes.STRING // Se recomienda usar INTEGER en lugar de NUMBER
        }
    },
    {
        createdAt: false, // Para que no tenga la columna createdAt
        updatedAt: false, // Para que no tenga la columna updatedAt
        tableName: 'detailscars'
    }
);

export default DetailCar;

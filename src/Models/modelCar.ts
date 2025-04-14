import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion';

interface CarsAttributes {
    id?: number,
    nombre?: string,
    descripcion?: string,
    precio?: number,
    stock?: number,
    user_id?: number
}

export interface CarsInterface
    extends Model<CarsAttributes>,
    CarsAttributes { }

// define crea o usa
const Car = db.define<CarsInterface>("Car", {
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    precio: {
        type: DataTypes.DOUBLE
    },
    stock: {
        type: DataTypes.INTEGER // Se recomienda usar INTEGER en lugar de NUMBER
    }
},
    {
        createdAt: false, // Para que no tenga la columna createdAt
        updatedAt: false // Para que no tenga la columna updatedAt
    });

export default Car;

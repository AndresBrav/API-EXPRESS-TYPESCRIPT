import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion';

// define crea o usa
const DetailCar = db.define("DetailCar", {
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
        tableName: "detailscars"
    });

export default DetailCar;

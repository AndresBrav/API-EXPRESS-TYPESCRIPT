import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion';
import DetailCar from './modelDetailCar';
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
        type: DataTypes.INTEGER // It is recommended to use INTEGER instead of NUMBER"
    }
},
    {
        createdAt: false, // no column createdAt
        updatedAt: false // no column  updatedAt
    });

Car.hasOne(DetailCar, {     /* "Un Car tiene un solo DetailCar. Úsalos con la clave foránea car_id en detailscars." */
    foreignKey: 'car_id'
})

// Relación uno a uno
DetailCar.belongsTo(Car, {
    foreignKey: 'car_id'        /* "DetailCar pertenece a un Car, y usa la columna car_id como su foreign key." */
});



export default Car;

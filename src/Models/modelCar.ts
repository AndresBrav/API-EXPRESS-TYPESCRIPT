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

Car.hasOne(DetailCar, {     /* "Un Car only has one  DetailCar.use with the foreing key  car_id in detailscars." */
    foreignKey: 'car_id'
})

// Relación uno a uno
DetailCar.belongsTo(Car, {
    foreignKey: 'car_id'        /* "DetailCar belongs to  a one Car, and use the column car_id as its foreign key." */
});



export default Car;

import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion'; // DB Conection
import Car from './modelCar';

// Define a interface for the attributes of model
interface UsersAttributes {
  id?: number
  login?: string;
  clave?: string;
  sts?: string;
  tipo?: string
}

// Define a interface for the instance of model
export interface UsersInstance
  extends Model<UsersAttributes>, // include methods like .save(), .destroy(), etc. // Methods from  Sequelize with types
  UsersAttributes { }           // allows direct access to username, edad, password

// Define the model
const User = db.define<UsersInstance>('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    type: DataTypes.STRING
  },
  clave: {
    type: DataTypes.STRING
  },
  sts: {
    type: DataTypes.STRING
  },
  tipo: {
    type: DataTypes.STRING
  }
}, {
  createdAt: false, // So that you do not have the createdAt column
  updatedAt: false // So that you do not have the updatedAt column
}
);

User.hasMany(Car, {
  foreignKey: 'user_id',
  sourceKey: 'id'
});

Car.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id'
});

export default User;

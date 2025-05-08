import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion'; // Asegúrate de que esta ruta sea correcta
import Car from './modelCar';

// Define una interfaz para los atributos del modelo
interface UsersAttributes {
  id?: number
  login?: string;
  clave?: string;
  sts?: string;
  tipo?: string
}

// Define una interfaz para la instancia del modelo
export interface UsersInstance
  extends Model<UsersAttributes>, // incluye métodos como .save(), .destroy(), etc. // Métodos de Sequelize con tipos
  UsersAttributes { }           // permite acceder directamente a username, edad, password

// Define el modelo con los tipos específicos
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
  createdAt: false, // Para que no tenga la columna createdAt
  updatedAt: false // Para que no tenga la columna
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

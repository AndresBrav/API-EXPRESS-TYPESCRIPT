import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion'; // DB Conection

// Define a interface for the attributes of model
interface FtpAttributes {
    id?: number
    transferMode?: string;
    host?: string;
    user?: string;
    password?: string;
    local_path?: string;
    remote_path?: string;
}

// Define a interface for the instance of model
export interface FtpInstance
    extends Model<FtpAttributes>, // include methods like .save(), .destroy(), etc. // Methods from  Sequelize with types
    FtpAttributes { }           // allows direct access to transfermode, host, password



// Define the model
const Ftp = db.define<FtpInstance>('Ftp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transferMode: {
        type: DataTypes.STRING
    },
    host: {
        type: DataTypes.STRING
    },
    user: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    local_path: {
        type: DataTypes.STRING
    },
    remote_path: {
        type: DataTypes.STRING
    }
}, {
    createdAt: false, // So that you do not have the createdAt column
    updatedAt: false, // So that you do not have the updatedAt column
    tableName: 'ftp'
}
);

export default Ftp;
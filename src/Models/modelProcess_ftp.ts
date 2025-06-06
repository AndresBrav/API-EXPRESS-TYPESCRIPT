import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion'; // DB Conection

// Define a interface for the attributes of model
interface ProcessFtpAttributes {
    id?: number;
    ftp_id?: number;
    file_name?: string;
    file_type?: string;
    file_size?: string;
    file_date_creation?: Date;
    file_download?: Date;
    state?: number;
}

// Define a interface for the instance of model
export interface ProcessFtpInstance
    extends Model<ProcessFtpAttributes>, // include methods like .save(), .destroy(), etc. // Methods from  Sequelize with types
        ProcessFtpAttributes {} // allows direct access to transfermode, host, password

// Define the model
const Process_ftp = db.define<ProcessFtpInstance>(
    'Process_ftp',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ftp_id: {
            type: DataTypes.INTEGER
        },
        file_name: {
            type: DataTypes.STRING
        },
        file_type: {
            type: DataTypes.STRING
        },
        file_size: {
            type: DataTypes.STRING
        },
        file_date_creation: {
            type: DataTypes.DATE
        },
        file_download: {
            type: DataTypes.DATE
        },
        state: {
            type: DataTypes.INTEGER
        }
    },
    {
        createdAt: false, // So that you do not have the createdAt column
        updatedAt: false, // So that you do not have the updatedAt column
        tableName: 'process_ftp'
    }
);



export default Process_ftp;

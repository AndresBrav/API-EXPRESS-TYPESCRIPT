import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion'; // DB Conection
import Process_ftp from './modelProcess_ftp';

// Define a interface for the attributes of model
interface FtpAttributes {
    id?: number;
    ftp_path?: string;
    host_ip?: string;
    user?: string;
    password?: string;
    type_file?: string;
    transfer_mode?: string;
    file_format?: string;
    local_directory?: string;
    interpreted_directory?: string;
    processed_directory?: string;
}

// Define a interface for the instance of model
export interface FtpInstance
    extends Model<FtpAttributes>, // include methods like .save(), .destroy(), etc. // Methods from  Sequelize with types
        FtpAttributes {} // allows direct access to transfermode, host, password

// Define the model
const Ftp = db.define<FtpInstance>(
    'Ftp',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ftp_path: {
            type: DataTypes.STRING
        },
        host_ip: {
            type: DataTypes.STRING
        },
        user: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        type_file: {
            type: DataTypes.STRING
        },
        transfer_mode: {
            type: DataTypes.STRING
        },
        file_format: {
            type: DataTypes.STRING
        },
        local_directory: {
            type: DataTypes.STRING
        },
        interpreted_directory: {
            type: DataTypes.STRING
        },
        processed_directory: {
            type: DataTypes.STRING
        }
    },
    {
        createdAt: false, // So that you do not have the createdAt column
        updatedAt: false, // So that you do not have the updatedAt column
        tableName: 'ftp'
    }
);

Ftp.hasMany(Process_ftp, {
    foreignKey: 'ftp_id',
    sourceKey: 'id'
});

Process_ftp.belongsTo(Ftp, {
    foreignKey: 'ftp_id',
    targetKey: 'id'
});

export default Ftp;

import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexion'; // DB Conection

// Define a interface for the attributes of model
interface HistoryFtpAttributes {
    id?: number
    name_file?: string;
    uploaded?: Date;
    downloaded?: Date;
    ftp_id?: number;
}

// Define a interface for the instance of model
export interface HistoryFtpInstance
    extends Model<HistoryFtpAttributes>, // include methods like .save(), .destroy(), etc. // Methods from  Sequelize with types
    HistoryFtpAttributes { }           // allows direct access to transfermode, host, password



// Define the model
const HistoryFtp = db.define<HistoryFtpInstance>('Ftp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_file: {
        type: DataTypes.STRING
    },
    uploaded: {
        type: DataTypes.DATE
    },
    downloaded: {
        type: DataTypes.DATE
    },
    ftp_id:{
        type:DataTypes.INTEGER /* foreign key */
    }
}, {
    createdAt: false, // So that you do not have the createdAt column
    updatedAt: false, // So that you do not have the updatedAt column
    tableName: 'history_ftp'
}
);

export default HistoryFtp;
import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config(); // ¡Esto carga el archivo .env!

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("carroscrudts", "root", "", {
    host: process.env.HOSTDB || 'localhost',
    dialect: "mysql",
});

export default sequelize
import { Sequelize } from "sequelize";

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("carroscrudts", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

export default sequelize
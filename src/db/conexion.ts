import { Sequelize } from "sequelize";

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("carroscrudts", "root", "", {
    host: "127.0.0.1",
    dialect: "mysql",
});

export default sequelize
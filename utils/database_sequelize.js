import { Sequelize } from "sequelize";

const sequelize = new Sequelize('online-shop', 'root', 'admin1771', {
    host: 'localhost',
    dialect: 'mysql'
})

export default sequelize
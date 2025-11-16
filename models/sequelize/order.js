import Sequelize from 'sequelize'
import sequelize from "../../utils/database_sequelize.js"

export const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
})
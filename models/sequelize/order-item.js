import Sequelize from 'sequelize'
import sequelize from "../../utils/database_sequelize.js"

export const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
})
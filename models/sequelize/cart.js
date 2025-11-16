import sequelize from "../../utils/database_sequelize.js";
import Sequelize from "sequelize"

export const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
})
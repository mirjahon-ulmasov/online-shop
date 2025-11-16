import Sequelize from "sequelize";
import sequelize from "../../utils/database_sequelize.js";

export const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    description: Sequelize.STRING,
});

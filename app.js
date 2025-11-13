import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Need to import all models inorder to sequelize aware of
import Product from "./models/sequelize/product.js";
import sequelize from "./utils/database_sequelize.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { getNotFound } from "./controllers/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(getNotFound);

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection successful");
        return sequelize.sync();
    })
    .then(() => {
        console.log("Database synced");
        app.listen(3000);
    })
    .catch((err) => console.error("Sequelize error:", err));
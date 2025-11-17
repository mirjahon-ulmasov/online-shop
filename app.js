import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { getNotFound } from "./controllers/error.js";
import { connectDB } from "./utils/database_nosql.js";

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

async function startServer() {
    try {
        await connectDB();
        app.listen(3000);
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}

startServer();

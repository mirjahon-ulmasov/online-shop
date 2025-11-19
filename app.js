import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import { getNotFound } from "./controllers/error.js";
import { User } from "./models/mongoose/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
    try {
        const user = await User.findById("691d8c15a09e69fa2ed8db2c");
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
    }
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(getNotFound);

async function createServer() {
    try {
        await connect(process.env.MONGO_URI, { dbName: "online-shop" });
        const user = await User.findOne();
        if (!user) {
            const user = new User({
                name: "Mirjahon Ulmasov",
                email: "mirjahonulmasov@gmail.com",
                cart: { items: [] },
            });
            await user.save();
        }
        app.listen(3000);
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}

createServer();

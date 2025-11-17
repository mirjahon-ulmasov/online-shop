import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { getNotFound } from "./controllers/error.js";
import { connectDB } from "./utils/database_nosql.js";
import { User } from "./models/nosql/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
    const user = await User.findById("691b2662f2f6a8f00b01247b");
    req.user = new User(user._id, user.name, user.email, user.cart);
    next();
});

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

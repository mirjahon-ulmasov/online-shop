import dotenv from "dotenv";
dotenv.config({ quiet: true });

import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import session from "express-session";
import MongoDBSession from "connect-mongodb-session";
import { csrfSync } from "csrf-sync";
import flash from "connect-flash";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import { getNotFound } from "./controllers/error.js";
import { User } from "./models/mongoose/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MongoDBStore = MongoDBSession(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    databaseName: "online-shop",
    collection: "sessions",
});

const { generateToken, csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: (req) => req.body["_csrf"],
});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: "my first node app in 2025",
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            secure: false, // change to true when uses https
            httpOnly: true,
            maxAge: 1000 * 60 * 60, // 1hour TTL (Time To Live)
        },
    })
);

app.use(async (req, res, next) => {
    try {
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            req.user = user;
        } else {
            req.user = null;
        }
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.use(csrfSynchronisedProtection);
app.use(flash());

app.use((req, res, next) => {
    // These get added in each ejs files
    res.locals.csrfToken = generateToken(req);
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    res.locals.errorMessages = req.flash("error");
    res.locals.successMessages = req.flash("success");
    next();
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(getNotFound);

async function createServer() {
    try {
        await connect(process.env.MONGO_URI, { dbName: "online-shop" });
        console.log("Connected to MongoDB");
        app.listen(3000);
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}

createServer();

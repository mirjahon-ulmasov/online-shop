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
import multer from "multer";
import fs from "fs";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import { getNotFound, getServerError } from "./controllers/error.js";
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

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true); // accept file
    } else {
        cb(null, false); // reject file (NOT save)
    }
};

const upload = multer({ storage, fileFilter });

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(upload.single("image"));

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

app.use(csrfSynchronisedProtection);
app.use(flash());

app.use((req, res, next) => {
    // These get added in each ejs files
    res.locals.csrfToken = generateToken(req);
    res.locals.isAuthenticated = req.session.isLoggedIn;

    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

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
        next(err);
    }
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(getNotFound);

app.use((err, req, res, next) => {
    res.status(500).render("500", {
        pageTitle: "Error!",
        path: "/500",
    });
});

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

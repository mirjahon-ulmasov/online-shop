import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Need to import all models inorder to sequelize aware of
import sequelize from "./utils/database_sequelize.js";
import { Product, User, Cart, CartItem, Order, OrderItem } from "./models/sequelize/index.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import { getNotFound } from "./controllers/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(getNotFound);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order)
Order.belongsTo(User)

Order.belongsToMany(Product, { through: OrderItem })
Product.belongsToMany(Order, { through: OrderItem })

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection successful");
        // return sequelize.sync({ force: true });
        return sequelize.sync();
    })
    .then(() => {
        console.log("Database synced");
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user) {
            return User.create({
                name: "Mirjahon",
                email: "mirjahonulmasov@gmail.com",
            });
        }
        return user;
    })
    .then((user) => {
        return user.getCart().then((cart) => {
            if (cart) {
                return cart;
            }
            return user.createCart();
        });
    })
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => console.error("Sequelize error:", err));

import { ObjectId } from "mongodb";
import { connectDB } from "../../utils/database_nosql.js";

export class User {
    constructor(id, name, email, cart) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.cart = cart;
    }

    async save() {
        const db = await connectDB();
        return db.collection("users").insertOne(this);
    }

    async addToCart(product) {
        const db = await connectDB();
        const updatedCartItems = [...(this.cart?.items || [])];
        const cartProductIndex = updatedCartItems.findIndex(
            (prod) => prod.productId.toString() == product._id.toString()
        );

        if (cartProductIndex >= 0) {
            updatedCartItems[cartProductIndex].quantity++;
        } else {
            updatedCartItems.push({ productId: product._id, quantity: 1 });
        }

        const updatedCart = { items: updatedCartItems };

        return db
            .collection("users")
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    }

    async removeCart(productId) {
        const filteredCartItems = this.cart.items.filter(
            (prod) => prod.productId.toString() != productId
        );
        const db = await connectDB();
        return db
            .collection("users")
            .updateOne(
                { _id: this._id },
                { $set: { cart: { items: filteredCartItems } } }
            );
    }

    async getCart() {
        const productIds = this.cart.items.map((prod) => prod.productId);
        const db = await connectDB();
        const products = await db
            .collection("products")
            .find({ _id: { $in: productIds } })
            .toArray();

        let balance = 0;
        const cartProducts = products.map((product) => {
            const foundProd = this.cart.items.find(
                (prod) => prod.productId.toString() == product._id.toString()
            );
            const prodQuantity = foundProd.quantity;
            balance += Number(product.price) * prodQuantity;
            return {
                ...product,
                quantity: prodQuantity,
            };
        });
        return { cartProducts, balance };
    }

    async createOrder() {
        const db = await connectDB();
        await db
            .collection("orders")
            .insertOne({ ...this.cart, userId: this._id });
        this.cart = { items: [] };
        return db
            .collection("users")
            .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
    }

    async getOrders() {
        const db = await connectDB();
        return db.collection("orders").find({ userId: this._id }).toArray();
    }

    async getOrderById(orderId) {
        const db = await connectDB();
        const order = await db
            .collection("orders")
            .findOne({ _id: new ObjectId(orderId) });

        const prodMap = new Map();
        for (const item of order.items) {
            prodMap.set(item.productId.toString(), item.quantity);
        }
        const prodIds = order.items.map((item) => item.productId);
        const products = await db
            .collection("products")
            .find({ _id: { $in: prodIds } }).toArray();

        const updadetProducts = products.map((product) => {
            product.quantity = prodMap.get(product._id.toString());
            return product
        });

        return updadetProducts
    }

    static async findById(id) {
        const db = await connectDB();
        return db.collection("users").findOne({ _id: new ObjectId(id) });
    }
}

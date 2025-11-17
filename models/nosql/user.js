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

    static async findById(id) {
        const db = await connectDB();
        return db.collection("users").findOne({ _id: new ObjectId(id) });
    }
}

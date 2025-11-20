import { model, Schema, Types } from "mongoose";
import { Order } from "./order.js";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
});

userSchema.methods.addToCart = function (product) {
    const productIdx = this.cart.items.findIndex(
        (item) => item.productId.toString() == product._id.toString()
    );
    if (productIdx >= 0) {
        this.cart.items[productIdx].quantity++;
    } else {
        this.cart.items.push({ productId: product._id, quantity: 1 });
    }
    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(
        (item) => item.productId != productId
    );
    return this.save();
};

userSchema.methods.addToOrder = async function () {
    const order = new Order({ products: this.cart.items, userId: this._id });
    await order.save();
    this.cart = { items: [] };
    return this.save();
};

export const User = model("User", userSchema);

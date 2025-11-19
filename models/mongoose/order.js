import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema({
    products: [
        {
            productId: {
                type: Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Order = model('Order', orderSchema)
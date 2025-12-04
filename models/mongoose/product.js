import { model, Schema, Types } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    description: String,
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const Product = model('Product', productSchema)

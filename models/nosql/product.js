import { ObjectId } from "mongodb";
import { connectDB } from "../../utils/database_nosql.js";

export class Product {
    constructor(id, title, price, description) {
        this.id = id
        this.title = title;
        this.price = price;
        this.description = description;
    }

    async save() {
        const db = await connectDB();
        return db.collection("products").insertOne(this);
    }

    async update() {
        const db = await connectDB();
        return db.collection('products').updateOne(
            { _id: new ObjectId(this.id) },
            { $set: this }
        )
    }

    static async deleteById(id) {
        const db = await connectDB();
        return db.collection('products').deleteOne({ _id: new ObjectId(id )})
    }

    static async fetchAll() {
        const db = await connectDB();
        return db.collection('products').find({}).toArray()
    }

    static async fetchById(id) {
        const db = await connectDB();
        return db.collection('products').findOne({ _id: new ObjectId(id) })
    }
}

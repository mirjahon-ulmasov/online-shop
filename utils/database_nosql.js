import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://mirjahon:aVfkCh7FEJ1RWUse@dev-aws-website.qcfgzis.mongodb.net/?appName=dev-aws-website';
const client = new MongoClient(uri);

let db;

export async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db("online-shop");

    console.log("MongoDB connected");
    return db;
}


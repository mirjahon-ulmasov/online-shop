import path from "path";
import fs from "fs";
import { rootDir } from "../utils/path.js";
import { Product } from "./product.js";

const p = path.join(rootDir, "data", "cart.json");

export class Cart {
    static addProduct(product) {
        let cart = { products: [], totalPrice: 0 };
        fs.readFile(p, (err, data) => {
            if (!err) cart = JSON.parse(data);
            const existingProd = cart.products.find(
                (prod) => prod.id == product.id
            );
            if (existingProd) {
                existingProd.count++;
            } else {
                cart.products.push({
                    id: product.id,
                    count: 1,
                });
            }
            cart.totalPrice += Number(product.price);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
    static getProducts(cb) {
        fs.readFile(p, (err, data) => {
            if (err) cb(null);
            else cb(JSON.parse(data))
        });
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, data) => {
            if(!err) {
                const cart = JSON.parse(data)
                const productIdx = cart.products.findIndex(prod => prod.id === id)
                if(productIdx >= 0) {
                    cart.totalPrice -= (Number(price) * cart.products[productIdx].count)
                    cart.products.splice(productIdx, 1)
                }
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    console.log(err)
                })
            }
        })
    }
}

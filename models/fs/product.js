import path from "path";
import fs from "fs";
import { rootDir } from "../../utils/path.js";
import { Cart } from "./cart.js";

const p = path.join(rootDir, "data", "products.json");

const getProductsFile = (cb) => {
    fs.readFile(p, (err, data) => {
        if (err) cb([]);
        else cb(JSON.parse(data));
    });
};

export class Product {
    constructor(id, title, price, desc) {
        this.id = id
        this.title = title;
        this.price = price;
        this.description = desc;
    }

    save() {
        getProductsFile((products) => {
            if(this.id) { // update
                const productIdx = products.findIndex(prod => prod.id == this.id)
                products[productIdx] = this
            } else { // create
                this.id = Date.now().toString()
                products.push(this);
            }
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) console.log(err);
            });
        });
    }

    static deleteById(id) {
        getProductsFile(products => {
            const productIdx = products.findIndex(prod => prod.id === id)
            if(productIdx >= 0) {
                const price = products[productIdx].price
                products.splice(productIdx, 1)

                fs.writeFile(p, JSON.stringify(products), (err) => {
                    Cart.deleteProduct(id, price)
                })
            }
        })
    }

    static fetchAll(cb) {
        getProductsFile(cb);
    }

    static fetchById(id, cb) {
        getProductsFile(products => {
            const product = products.find(prod => prod.id == id)
            cb(product)
        })
    }
}

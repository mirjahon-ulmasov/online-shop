import path from "path";
import fs from "fs";
import { rootDir } from "../utils/path.js";

const p = path.join(rootDir, "data", "products.json");

const getProductsFile = (cb) => {
    fs.readFile(p, (err, data) => {
        if (err) cb([]);
        else cb(JSON.parse(data));
    });
};

export class Product {
    constructor(title, desc) {
        this.title = title;
        this.description = desc;
    }

    save() {
        getProductsFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFile(cb);
    }
}

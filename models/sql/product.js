import db from "../../utils/database.js"

export class Product {
    constructor(id, title, price, description) {
        this.id = id
        this.title = title
        this.price = price
        this.description = description
    }

    save() {
        if (this.id) {
            return db.execute(
                'UPDATE products SET title = ?, price = ?, description = ? WHERE id = ?',
                [this.title, this.price, this.description, this.id]
            )
        } else {
            return db.execute(
                'INSERT INTO products (title, price, description) VALUES (?, ?, ?)',
                [this.title, this.price, this.description]
            )
        }
    }

    static deleteById(id) {
        return db.execute('DELETE FROM products WHERE id = ?', [id])
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static fetchById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?', [id])
    }
}
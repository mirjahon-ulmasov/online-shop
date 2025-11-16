import { Product } from "../../models/sequelize/index.js";

export const getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts();
        })
        .then((products) => {
            const balance = products.reduce(
                (acc, cur) => acc + cur.cartItem.quantity * Number(cur.price),
                0
            );
            res.render("shop/cart", {
                pageTitle: "Shop",
                path: "/cart",
                cartProducts: products,
                balance,
            });
        });
};

export const postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let quantity = 1;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            if (products.length == 0) {
                return Product.findByPk(productId);
            }
            const product = products[0];
            quantity = product.cartItem.quantity + 1;
            return product;
        })
        .then((product) => {
            console.log(product);
            return fetchedCart.addProduct(product, { through: { quantity } });
        })
        .then(() => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

export const deleteCart = (req, res, next) => {
    const productId = req.body.id;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => res.redirect("/cart"))
        .catch((err) => console.log(err));
};
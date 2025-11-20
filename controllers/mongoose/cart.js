import { Product } from "../../models/mongoose/product.js";

export const postCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        await req.user.addToCart(product);
        res.redirect("/cart");
    } catch (err) {
        console.log(err);
    }
};

export const getCart = async (req, res, next) => {
    try {
        const user = await req.user.populate("cart.items.productId");
        const cartProducts = user.cart.items;
        let balance = cartProducts.reduce(
            (acc, cur) => acc + cur.productId.price * cur.quantity,
            0
        );

        res.render("shop/cart", {
            pageTitle: "Shop",
            path: "/cart",
            cartProducts,
            balance,
            isAuthenticated: req.session.isLoggedIn,
        });
    } catch (err) {
        console.log(err);
    }
};

export const deleteCart = async (req, res, next) => {
    try {
        const productId = req.body.id;
        await req.user.removeFromCart(productId);
        res.redirect("/cart");
    } catch (err) {
        console.log(err);
    }
};

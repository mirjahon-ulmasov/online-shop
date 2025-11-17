import { Product } from "../../models/nosql/product.js";

export const getCart = async (req, res, next) => {
    const { cartProducts, balance } = await req.user.getCart();
    res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cartProducts,
        balance,
    });
};

export const postCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await Product.fetchById(productId);
        await req.user.addToCart(product);
        res.redirect("/cart");
    } catch (err) {
        console.log(err);
    }
};

export const deleteCart = async (req, res, next) => {
    try {
        const productId = req.body.id;
        await req.user.removeCart(productId);
        res.redirect("/cart");
    } catch (err) {
        console.log(err);
    }
};

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

export const postAddOrder = async (req, res, next) => {
    try {
        await req.user.createOrder()
        res.redirect('/orders')
    } catch(err) {
        console.log(err);
    }
}

export const getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders()        
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders
        })
    } catch(err) {
        console.log(err);
    }
}

export const getOrder = async (req, res, next) => {
    const orderId = req.params.orderId
    try {
        const products = await req.user.getOrderById(orderId)        
        res.render('shop/order-detail', {
            pageTitle: 'Order Detail',
            path: '/orders',
            products
        })
    } catch(err) {
        console.log(err);
    }
}
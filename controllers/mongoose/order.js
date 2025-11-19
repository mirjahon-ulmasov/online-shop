import { Order } from "../../models/mongoose/order.js";

export const postAddOrder = async (req, res, next) => {
    try {
        await req.user.addToOrder();
        res.redirect("/orders");
    } catch (err) {
        console.log(err);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user }).populate("products.productId");
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders
        })
    } catch (err) {
        console.log(err);
    }
};

import { Order } from "../../models/mongoose/order.js";

export const postAddOrder = async (req, res, next) => {
    try {
        await req.user.addToOrder();
        res.redirect("/orders");
    } catch (err) {
        console.log('Error: postAddOrder');
        next(err);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user }).populate(
            "products.productId"
        );
        res.render("shop/orders", {
            pageTitle: "Orders",
            path: "/orders",
            orders,
        });
    } catch (err) {
        console.log('Error: getOrders');
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate(
            "products.productId userId"
        );

        const products = order.products.map((prod) => {
            return {
                ...prod.productId._doc,
                quantity: prod.quantity,
            };
        });

        res.render("shop/order-detail", {
            pageTitle: "Order Detail",
            path: "/orders",
            products,
            isAuthenticated: req.session.isLoggedIn,
        });
    } catch (err) {
        console.log('Error: getOrder');
        next(err);
    }
};

export const getOrders = (req, res, next) => {
    req.user.getOrders().then((orders) => {
        res.render("shop/orders", {
            pageTitle: "Order",
            path: "/orders",
            orders,
        });
    });
};

export const getOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    req.user
        .getOrders({ where: { id: orderId } })
        .then((orders) => {
            return orders[0].getProducts();
        })
        .then((products) => {
            res.render("shop/order-detail", {
                pageTitle: "Order Detail",
                path: "/orders",
                products,
            });
        });
};

export const postAddOrder = async (req, res, next) => {
    try {
        const order = await req.user.createOrder();
        const cart = await req.user.getCart();
        const products = await cart.getProducts();
        await order.addProducts(
            products.map((product) => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            })
        );

        await cart.setProducts(null);
        res.redirect("/orders");
    } catch (err) {
        console.log(err);
    }
};

import { Product } from "../models/product.js";

// ----------------- Admin Pages -----------------
export const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
    });
};

export const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description);
    product.save();
    res.status(302).redirect("/");
};

export const getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/product-list", {
            pageTitle: "Admin Products",
            products,
            path: "/admin/products",
        });
    });
};

// ----------------- User Pages -----------------
export const getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/index", {
            pageTitle: "Shop",
            products,
            path: "/",
        });
    });
};

export const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/product-list", {
            pageTitle: "Products",
            products,
            path: "/products",
        });
    });
};

export const getCart = (req, res, next) => {
    res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
    });
};

export const getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
    });
};

export const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
    });
};

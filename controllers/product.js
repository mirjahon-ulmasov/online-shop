import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
    });
};

export const postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.description)
    product.save()
    res.status(302).redirect("/");
};

export const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("products", {
            pageTitle: "Products",
            products,
            path: "/products",
        });
    })
};
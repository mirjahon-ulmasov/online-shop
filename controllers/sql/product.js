import { Product } from "../../models/sql/product.js";

// --------------- User ---------------
export const getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows]) => {
        res.render("shop/index", {
            pageTitle: "Shop Page",
            path: "/",
            products: rows,
        });
    });
};

export const getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows]) => {
        res.render("shop/product-list", {
            pageTitle: "Products Page",
            path: "/products",
            products: rows,
        });
    });
};

export const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetchById(productId).then(([rows]) => {
        res.render("shop/product-detail", {
            pageTitle: "Product Detail",
            path: "/products",
            product: rows[0],
        });
    });
};

// --------------- Admin ---------------

// CREATE
export const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

export const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, price, description);
    product.save().then(() => {
        res.redirect("/admin/products");
    });
};

// READ
export const getAdminProducts = (req, res, next) => {
    Product.fetchAll().then(([rows]) => {
        res.render("admin/product-list", {
            pageTitle: "Admin Products",
            path: "/admin/products",
            products: rows,
        });
    });
};

// UPDATE
export const getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = Boolean(req.query.editing);
    Product.fetchById(productId).then(([rows]) => {
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: rows[0],
        });
    });
};

export const postEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(productId, title, price, description);
    product.save().then(() => {
        res.redirect("/admin/products");
    });
};

// DELETE
export const postDeleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.deleteById(productId).then(() => {
        res.redirect("/admin/products");
    });
};

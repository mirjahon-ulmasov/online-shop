import { Product } from "../../models/sequelize/index.js";

export const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    req.user
        .createProduct({ title, price, description })
        .then(() => {
            console.log("Product saved");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

export const getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editing = Boolean(req.query.editing);
    Product.findByPk(productId).then((product) => {
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing,
            product,
        });
    });
};

// Update 1st way
export const postEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    Product.update({ title, price, description }, { where: { id: productId } })
        .then(([affectedRows]) => {
            if (affectedRows === 0) {
                console.log("No product found with this ID");
            } else {
                console.log("Product updated successfully");
            }
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

// Update 2nd way
export const postEdit2Product = (req, res, next) => {
    const productId = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    Product.findByPk(productId)
        .then((product) => {
            product.title = title;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(() => {
            console.log(`Product with ID ${productId} UPDATED successfully`);
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

export const postDeleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.destroy({ where: { id: productId } })
        .then(() => {
            console.log(`Product with ID ${productId} DELETED successfully`);
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

export const getAdminProducts = (req, res, next) => {
    // Product.findAll()
    req.user.getProducts()
        .then((products) => {
            res.render("admin/product-list", {
                pageTitle: "Admin Products",
                path: "/admin/products",
                products,
            });
        })
        .catch((err) => console.log(err));
};

export const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    // Product.findOne({ where: { id: productId } }).then((product) => {
    Product.findByPk(productId).then((product) => {
        res.render("shop/product-detail", {
            pageTitle: "Page Detail",
            path: "/products",
            product,
        });
    })
    .catch((err) => console.log(err));
};

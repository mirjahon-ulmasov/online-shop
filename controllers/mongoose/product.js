import { Product } from "../../models/mongoose/product.js";

export const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

export const postAddProduct = async (req, res, next) => {
    try {
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const product = new Product({
            title,
            price,
            description,
            userId: req.user,
        });
        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        console.log(err);
    }
};

export const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ price: { $gt: 100 } });
        // .select('title price') // selects only these fields
        // .populate('userId') // gets all user info
        res.render("admin/product-list", {
            pageTitle: "Admin Products",
            path: "/admin/products",
            products,
        });
    } catch (err) {
        console.log(err);
    }
};

export const getEditProduct = async (req, res, next) => {
    try {
        const prodId = req.params.productId;
        const product = await Product.findById(prodId);
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            product,
        });
    } catch (err) {
        console.log(err);
    }
};

export const postEditProduct = async (req, res, next) => {
    try {
        const prodId = req.params.productId;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        const product = await Product.findById(prodId);
        product.title = title;
        product.price = price;
        product.description = description;

        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        console.log(err);
    }
};

export const postDeleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        await Product.findByIdAndDelete(productId);
        res.redirect("/admin/products");
    } catch (err) {
        console.log(err);
    }
};

// User
export const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        res.render("shop/product-detail", {
            pageTitle: "Product Detail",
            path: "products",
            product,
        });
    } catch (err) {
        console.log(err);
    }
};

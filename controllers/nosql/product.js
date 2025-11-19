import { Product } from "../../models/nosql/product.js";

export const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render("admin/product-list", {
            pageTitle: "Admin Products",
            path: "/admin/products",
            products,
        });
    } catch (err) {
        console.log(err);
    }
};

export const postAddProduct = async (req, res, next) => {
    try {
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        const product = new Product(null, title, price, description);
        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        console.log(err);
    }
};

export const getEditProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.fetchById(productId)
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product
            
        })
    } catch (err) {
        console.log(err);
    }
};

export const postEditProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;

        const product = new Product(productId, title, price, description)
        await product.update()
        res.redirect('/admin/products')
    } catch (err) {
        console.log(err);
    }
};

export const postDeleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId
        await Product.deleteById(productId)
        res.redirect('/admin/products')
    } catch(err) {
        console.log(err);
    }
}

// ------------------ User ------------------
export const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.fetchById(productId);
        res.render("shop/product-detail", {
            pageTitle: "Product Detail",
            path: "/products",
            product,
        });
    } catch (err) {
        console.log(err);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render("shop/product-list", {
            pageTitle: "Products",
            path: "/products",
            products,
        });
    } catch (err) {
        console.log(err);
    }
};

export const getIndex = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render("shop/index", {
            pageTitle: "Shop",
            path: "/",
            products,
        });
    } catch (err) {
        console.log(err);
    }
};

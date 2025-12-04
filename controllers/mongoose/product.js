import { Product } from "../../models/mongoose/product.js";
import { deleteFile } from "../../utils/file.js";

export const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ userId: req.user });
        // const products = await Product.find({ price: { $gt: 100 } });
        // .select('title price') // selects only these fields
        // .populate('userId') // gets all user info
        res.render("admin/product-list", {
            pageTitle: "Admin Products",
            path: "/admin/products",
            products,
        });
    } catch (err) {
        console.log('Error: getAdminProducts');
        next(err);
    }
};

export const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        product: {},
        errors: [],
    });
};

export const postAddProduct = async (req, res, next) => {
    try {
        if (res.locals.validationErrors) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                product: req.body,
                errors: res.locals.validationErrors,
            });
        }

        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const image = req.file
        
        if(!image) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                product: req.body,
                errors: [{ msg: 'Please select files with types: jpeg, jpg, png' }],
            }); 
        }
        
        const product = new Product({
            title,
            price,
            description,
            userId: req.user,
            image: '/' + image.path
        });
        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        console.log('Error: postAddProduct');
        next(err);
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
            errors: [],
        });
    } catch (err) {
        console.log('Error: getEditProduct');
        next(err);
    }
};

export const postEditProduct = async (req, res, next) => {
    try {
        if (res.locals.validationErrors) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: true,
                product: req.body,
                errors: res.locals.validationErrors,
            });
        }

        const prodId = req.params.productId;
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const image = req.file

        const product = await Product.findOne({
            _id: prodId,
            userId: req.user,
        });
        product.title = title;
        product.price = price;
        product.description = description;

        if (image) {
            deleteFile(product.image.slice(1)) // remove '/'
            product.image = '/' + image.path
        }

        await product.save();
        res.redirect("/admin/products");
    } catch (err) {
        console.log('Error: postEditProduct');
        next(err);
    }
};

export const postDeleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId)
        if (product) {
            deleteFile(product.image.slice(1)) // remove '/'
            await Product.deleteOne({ _id: productId, userId: req.user });
        }
        res.redirect("/admin/products");
    } catch (err) {
        console.log('Error: postDeleteProduct');
        next(err);
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
        console.log('Error: getProduct');
        next(err);
    }
};

export const getIndex = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render("shop/index", {
            pageTitle: "Shop",
            path: "/",
            products,
            isAuthenticated: req.session.isLoggedIn,
        });
    } catch (err) {
        console.log('Error: getIndex');
        next(err);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render("shop/product-list", {
            pageTitle: "Products",
            path: "/products",
            products,
            isAuthenticated: req.session.isLoggedIn,
        });
    } catch (err) {
        console.log('Error: getProducts');
        next(err);
    }
};

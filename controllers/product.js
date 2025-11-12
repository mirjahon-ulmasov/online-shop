import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

// ----------------- Admin Pages -----------------
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
    product.save();
    res.redirect("/");
};

export const getEditProduct = (req, res, next) => {
    const editMode = Boolean(req.query.editing);
    if (!editMode) {
        return res.redirect("/admin/products");
    }
    const productId = req.params.productId;
    Product.fetchById(productId, (product) => {
        if (!product) {
            return res.redirect("/admin/products");
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product,
        });
    });
};

export const postEditProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const productId = req.params.productId;
    const product = new Product(productId, title, price, description);
    product.save();
    res.redirect("/");
};

export const postDeleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.deleteById(productId);
    res.redirect("/admin/products");
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

export const getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.fetchById(prodId, (product) => {
        res.render("shop/product-detail", {
            pageTitle: "Product Detail",
            product,
            path: "/products",
        });
    });
};

export const getCart = (req, res, next) => {
    Cart.getProducts((cart) => {
        Product.fetchAll((products) => {
            const cartMap = new Map();
            for (let prod of cart.products) {
                cartMap.set(prod.id, prod.count);
            }
            const cartProducts = [];
            for (let prod of products) {
                if (cartMap.has(prod.id)) {
                    cartProducts.push({ ...prod, count: cartMap.get(prod.id) });
                }
            }
            res.render("shop/cart", {
                pageTitle: "Cart",
                path: "/cart",
                cartProducts,
                balance: cart.totalPrice ?? 0
            });
        });
    });
};

export const postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.fetchById(productId, (product) => {
        Cart.addProduct(product);
    });
    res.redirect("/cart");
};

export const deleteCart = (req, res, next) => {
    const productId = req.body.id;
    Product.fetchById(productId, (product) => {
        Cart.deleteProduct(productId, product.price)
        res.redirect('/cart')
    })
}

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

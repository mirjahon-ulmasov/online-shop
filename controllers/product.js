const products = [];

export const getAddProduct = (req, res, next) => {
  res.render("add-product", { pageTitle: "Add Product", path: "/add-product" });
};

export const postAddProduct = (req, res, next) => {
  products.push(req.body);
  res.status(302).redirect("/");
};

export const getProducts = (req, res, next) => {
    res.render('products', { pageTitle: 'Products', products, path: '/products'  })
}
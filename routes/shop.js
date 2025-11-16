import { Router } from "express";
import { getCheckout } from "../controllers/fs/product.js";
import { getIndex, getProducts } from "../controllers/sql/product.js";

import { getProduct } from "../controllers/sequelize/product.js";
import { getCart, postCart, deleteCart } from "../controllers/sequelize/cart.js";
import { getOrder, getOrders, postAddOrder } from "../controllers/sequelize/order.js"

const router = Router()

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post('/delete-cart', deleteCart)

router.get("/orders", getOrders);

router.get("/orders/:orderId", getOrder);

router.post("/order", postAddOrder);

router.get("/checkout", getCheckout);

// router.post('/add-to-cart')

export default router
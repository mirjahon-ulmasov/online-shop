import { Router } from "express";
import { getIndex, getProducts } from "../controllers/nosql/product.js";

import { getCart, postCart, deleteCart } from "../controllers/mongoose/cart.js";
import { getOrders, postAddOrder } from "../controllers/mongoose/order.js";
import { getProduct } from "../controllers/mongoose/product.js";

const router = Router()

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post('/delete-cart', deleteCart)

router.get("/orders", getOrders);

// router.get("/orders/:orderId", getOrder);

router.post("/order", postAddOrder);

export default router
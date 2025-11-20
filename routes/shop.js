import { Router } from "express";

import { getCart, postCart, deleteCart } from "../controllers/mongoose/cart.js";
import { getOrders, getOrder, postAddOrder } from "../controllers/mongoose/order.js";
import { getIndex, getProducts, getProduct } from "../controllers/mongoose/product.js";
import { isAuth } from "../middlewares/is-auth.js";

const router = Router()

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post('/delete-cart', isAuth, deleteCart)

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getOrder);

router.post("/order", isAuth, postAddOrder);

export default router
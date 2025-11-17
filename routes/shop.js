import { Router } from "express";
import { getIndex, getProduct, getProducts } from "../controllers/nosql/product.js";

const router = Router()

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

// router.get("/cart", getCart);

// router.post("/cart", postCart);

// router.post('/delete-cart', deleteCart)

// router.get("/orders", getOrders);

// router.get("/orders/:orderId", getOrder);

// router.post("/order", postAddOrder);

// router.post('/add-to-cart')

export default router
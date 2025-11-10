import { Router } from "express";
import { getCart, getIndex, getProducts, getOrders, getCheckout } from "../controllers/product.js";

const router = Router()

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/cart", getCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

// router.post('/add-to-cart')

export default router
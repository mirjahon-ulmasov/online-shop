import { Router } from "express";
import { getCart, postCart, deleteCart, getIndex, getProducts, getProduct, getOrders, getCheckout } from "../controllers/product.js";

const router = Router()

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post('/delete-cart', deleteCart)

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

// router.post('/add-to-cart')

export default router
import { Router } from "express";
import {
    getAddProduct,
    postAddProduct,
    getAdminProducts,
    getEditProduct,
    postEditProduct,
    postDeleteProduct
} from "../controllers/product.js";

const router = Router();

// Create
router.get("/add-product", getAddProduct);
router.post("/add-product", postAddProduct);

// List
router.get("/products", getAdminProducts);

// Edit
router.get("/edit-product/:productId", getEditProduct);
router.post('/edit-product/:productId', postEditProduct)

// Delete
router.post('/delete-product/:productId', postDeleteProduct)

export default router;

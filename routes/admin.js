import { Router } from "express";
import {
    getAdminProducts,
    getAddProduct,
    postAddProduct,
    getEditProduct,
    postEditProduct,
    postDeleteProduct,
} from "../controllers/mongoose/product.js";
const router = Router();

// CREATE
router.get("/add-product", getAddProduct);
router.post("/add-product", postAddProduct);

// READ
router.get("/products", getAdminProducts);

// UPDATE
router.get("/edit-product/:productId", getEditProduct);
router.post("/edit-product/:productId", postEditProduct);

// DELETE
router.post("/delete-product/:productId", postDeleteProduct);

export default router;

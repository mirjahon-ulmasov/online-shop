import { Router } from "express";
import { getAddProduct } from "../controllers/sql/product.js";
import {
    getAdminProducts,
    getEditProduct,
    postAddProduct,
    postDeleteProduct,
    postEditProduct,
} from "../controllers/nosql/product.js";
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

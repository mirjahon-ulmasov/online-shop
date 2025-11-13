import { Router } from "express";
import { getAddProduct } from "../controllers/sql/product.js";
import {
    getAdminProducts,
    postAddProduct,
    getEditProduct,
    postEdit2Product,
    postDeleteProduct,
} from "../controllers/sequelize/product.js";

const router = Router();

// CREATE
router.get("/add-product", getAddProduct);
router.post("/add-product", postAddProduct);

// READ
router.get("/products", getAdminProducts);

// UPDATE
router.get("/edit-product/:productId", getEditProduct);
router.post("/edit-product/:productId", postEdit2Product);

// DELETE
router.post("/delete-product/:productId", postDeleteProduct);

export default router;

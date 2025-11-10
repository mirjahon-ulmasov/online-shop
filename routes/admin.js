import { Router } from "express";
import { getAddProduct, postAddProduct, getAdminProducts } from "../controllers/product.js";

const router = Router();

// Create
router.get("/add-product", getAddProduct);
router.post("/add-product", postAddProduct);

// List
router.get("/products", getAdminProducts);

// Edit
// router.get('/edit-product')
// router.post('/edit-product')

// Delete
// router.post('/delete-product')

export default router
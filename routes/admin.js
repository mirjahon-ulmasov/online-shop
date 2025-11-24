import { Router } from "express";
import {
    getAdminProducts,
    getAddProduct,
    postAddProduct,
    getEditProduct,
    postEditProduct,
    postDeleteProduct,
} from "../controllers/mongoose/product.js";
import { isAuth } from "../middlewares/is-auth.js";
import { productValidator } from "../validators/edit-product.js";
import { handleValidation } from "../middlewares/handle-validation.js";

const router = Router();

// CREATE
router.get("/add-product", isAuth, getAddProduct);
router.post("/add-product", isAuth, productValidator, handleValidation, postAddProduct);

// READ
router.get("/products", isAuth, getAdminProducts);

// UPDATE
router.get("/edit-product/:productId", isAuth, getEditProduct);
router.post("/edit-product/:productId", isAuth, productValidator, handleValidation, postEditProduct);

// DELETE
router.post("/delete-product/:productId", isAuth, postDeleteProduct);

export default router;

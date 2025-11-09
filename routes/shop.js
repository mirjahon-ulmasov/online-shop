import { Router } from "express";
import { getProducts } from "../controllers/product.js";

const router = Router()

router.get("/", getProducts);

export default router
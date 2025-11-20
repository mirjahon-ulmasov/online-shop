import { Router } from "express";
import {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
} from "../controllers/mongoose/auth.js";

const router = Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.post("/logout", postLogout);

export default router;

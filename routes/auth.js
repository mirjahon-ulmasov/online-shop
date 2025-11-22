import { Router } from "express";
import {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getResetPassword,
    postResetPassword,
    getNewPassword,
    postNewPassword
} from "../controllers/mongoose/auth.js";

const router = Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.post("/logout", postLogout);

router.get("/reset", getResetPassword)

router.post("/reset", postResetPassword)

router.get("/reset/:token", getNewPassword)

router.post("/new-password", postNewPassword)


export default router;

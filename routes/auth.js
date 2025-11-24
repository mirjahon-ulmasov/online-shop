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
    postNewPassword,
} from "../controllers/mongoose/auth.js";
import { signUpValidators } from "../validators/sign-up.js";
import { handleValidation } from "../middlewares/handle-validation.js";
import { loginValidators } from "../validators/login-in.js";

const router = Router();

router.get("/login", getLogin);

router.post("/login", loginValidators, handleValidation, postLogin);

router.get("/signup", getSignup);

router.post("/signup", signUpValidators, handleValidation, postSignup);

router.post("/logout", postLogout);

router.get("/reset", getResetPassword);

router.post("/reset", postResetPassword);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export default router;

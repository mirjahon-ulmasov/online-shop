import { body } from "express-validator";
import { User } from "../models/mongoose/user.js";
import bcrypt from "bcryptjs";

export const loginValidators = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .bail()
        .normalizeEmail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new Error("Invalid credentials");
            }
            req.userFromLogin = user;
            return true;
        }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password field is empty")
        .bail()
        .custom(async (value, { req }) => {
            const user = req.userFromLogin;
            const doMatch = await bcrypt.compare(value, user.password);
            if (!doMatch) {
                throw new Error("Invalid credentials");
            }
            return true;
        }),
];

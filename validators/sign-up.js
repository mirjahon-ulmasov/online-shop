import { body } from "express-validator";
import { User } from "../models/mongoose/user.js";

export const signUpValidators = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .bail()
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("User with this email already exists.");
            }
            return true;
        }),
    body("password")
        .trim()
        .isStrongPassword()
        .withMessage(
            "Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol."
        ),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password and confirmation do not match.");
            }
            return true;
        }),
];

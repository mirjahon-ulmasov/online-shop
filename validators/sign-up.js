import { body } from "express-validator";
import { User } from "../models/mongoose/user.js";

export const signUpValidators = [
    body("email")
        .isEmail()
        .withMessage("Please provide real email")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("User with this email already exists.");
            }
            return true;
        }),
    body("password")
        .isStrongPassword()
        .withMessage(
            "Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol."
        ),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password and confirmation do not match.");
        }
        return true;
    }),
];

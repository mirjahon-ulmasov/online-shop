import { Types } from "mongoose";
import { body, param } from "express-validator";
import { Product } from "../models/mongoose/product.js";

export const productValidator = [
    param("productId").custom(async (value, { req }) => {
        if (!value) return true;
        if (!Types.ObjectId.isValid(value)) {
            throw new Error("Invalid product ID");
        }
        
        const product = await Product.findOne({
            _id: value,
            userId: req.user,
        });

        if (!product) throw new Error("Product not found");
        return true;
    }),
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .bail()
        .isLength({ max: 15 })
        .withMessage("Length of title must be less than 15 characters")
        .escape(), // remove HTML tags

    body("price")
        .trim()
        .notEmpty()
        .withMessage("Price is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Please give a valid price"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isLength({ max: 50 })
        .withMessage("Length of description must be less than 50 characters")
        .escape(), // remove HTML tags
];

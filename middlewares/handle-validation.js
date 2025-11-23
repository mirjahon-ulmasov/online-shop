import { validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    res.locals.validationErrors = errors.isEmpty() ? null : errors.array();
    next();
};
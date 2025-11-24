import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../../models/mongoose/user.js";
import { sendEmail } from "../../utils/email.js";

export const getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errors: [],
        oldInputs: {}
    });
};

export const postLogin = async (req, res, next) => {
    try {
        if (res.locals.validationErrors) {
            console.log(res.locals.validationErrors);
            
            return res.status(422).render("auth/login", {
                pageTitle: "Login",
                path: "/login",
                errors: res.locals.validationErrors,
                oldInputs: req.body
            });
        }

        const user = await User.findOne({ email: req.body.email })
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
            res.redirect("/");
        });
    } catch (err) {
        console.log(err);
    }
};

export const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};

export const getSignup = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
        errors: [],
        oldInputs: {},
    });
};

export const postSignup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (res.locals.validationErrors) {
            return res.status(422).render("auth/signup", {
                pageTitle: "Sign Up",
                path: "/signup",
                errors: res.locals.validationErrors,
                oldInputs: req.body,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        await user.save();
        req.flash("success", "You successfully signed up");
        res.redirect("/login");
        sendEmail(
            email,
            "Welcome to Online Shop",
            "<h2>Welcome!</h2><p>Thank you for signing up. Your account has been successfully created.</p><p>You can now log in and start using our service.</p>"
        );
    } catch (err) {
        console.error("Signup Error:", err);
        next(err);
    }
};

export const getResetPassword = (req, res, next) => {
    res.render("auth/reset", {
        pageTitle: "Reset Password",
        path: "/reset-password",
        errors: []
    });
};

export const postResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "User not found with this email");
            return res.redirect("/reset");
        }
        const token = crypto.randomBytes(32).toString("hex");
        user.reset = {
            token,
            expireDate: new Date(Date.now() + 1000 * 60 * 60),
        };
        await user.save();
        req.flash("success", "Reset link was sent to your email");
        res.redirect("/login");
        sendEmail(
            email,
            "Reset Password",
            `<p>Please click to this <a href='http://localhost:3000/reset/${token}'>link</a> to reset your password</p>`
        );
    } catch (err) {
        console.log(err);
    }
};

export const getNewPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({
            "reset.token": token,
            "reset.expireDate": { $gt: new Date() },
        });

        if (!user) {
            return res.redirect("/");
        }

        res.render("auth/new-password", {
            pageTitle: "New Password",
            path: "/new-password",
            userId: user._id,
            resetToken: token,
            errors: []
        });
    } catch (err) {
        console.log(err);
    }
};

export const postNewPassword = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const resetToken = req.body.resetToken;
        const password = req.body.password;

        const user = await User.findOne({
            "reset.token": resetToken,
            "reset.expireDate": { $gt: new Date() },
            _id: userId,
        });

        if (!user) {
            return res.redirect("/");
        }
        const newPassword = await bcrypt.hash(password, 12);
        user.password = newPassword;
        user.reset = undefined;
        await user.save();

        req.flash("success", "Your password successfully changed");
        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
};

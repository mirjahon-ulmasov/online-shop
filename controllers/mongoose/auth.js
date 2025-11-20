import { User } from "../../models/mongoose/user.js";
import bcrypt from "bcryptjs";

export const getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
    });
};

export const postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });
        if (!user) return res.redirect("/login");

        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) return res.redirect("/login");

        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
            console.log(err);
            res.redirect("/");
        });
    } catch (err) {
        console.log(err);
    }
};

export const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/login");
    });
};

export const getSignup = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Sign Up",
        path: "/signup",
    });
};

export const postSignup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.redirect("/signup");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
};

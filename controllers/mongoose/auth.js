import { User } from "../../models/mongoose/user.js";

export const getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: req.session.isLoggedIn,
    });
};

export const postLogin = async (req, res, next) => {
    try {
        const user = await User.findById("691d8c15a09e69fa2ed8db2c");
        req.session.user = user;
        req.session.isLoggedIn = true;
        res.session.save((err) => {
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

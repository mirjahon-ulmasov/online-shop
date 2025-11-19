export const getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
    });
};

export const postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);

    res.redirect("/");
};

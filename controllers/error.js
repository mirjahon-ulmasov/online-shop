export const getNotFound = (req, res, next) => {
    res.render("404", {
        pageTitle: "404",
        path: "/404",
        isAuthenticated: req.session.isLoggedIn,
    });
};

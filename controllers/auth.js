// This is for Login view
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

// This is for Login view
exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true;
  res.redirect("/");
};

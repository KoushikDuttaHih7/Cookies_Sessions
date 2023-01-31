const User = require("../models/user");

// This is for Login view
exports.getLogin = (req, res, next) => {
  const isLoggedIn =
    // req.get("Cookie").split(";")[0].trim().split("=")[1] === "true";
    console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

// This is for Login view
exports.postLogin = (req, res, next) => {
  User.findById("63d8f8df2a80a6c69d0b84ed")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

// This is for Logout view
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

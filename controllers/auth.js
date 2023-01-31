// This is for Login view
exports.getLogin = (req, res, next) => {
  const isLoggedIn =
    req.get("Cookie").split(";")[0].trim().split("=")[1] === "true";
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

// This is for Login view
exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

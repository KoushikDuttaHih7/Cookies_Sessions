const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = required("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const port = 5000;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "My Secret", resave: false, saveUninitialized: false })
);
// resave: false -> this means that the session will not be saved on every request
// that is done, so on every response that is sent but only if
// something changed in the session., this will obviously improve performance and so on.

// saveUninitialized: false -> this will also basically ensure that no session gets saved for a request where
// it doesn't need to be saved because nothing waschanged about it

app.use((req, res, next) => {
  User.findById("63d8a54ebeb6de9bea159fde")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://Koushik-Shop:koushik.shop@cluster-shop.yyknzpb.mongodb.net/shop-cookies?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Cookies",
          email: "cookies@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(port, () => {
      console.log("Server started at http://localhost:5000/");
    });
  })
  .catch((err) => {
    console.log(err);
  });

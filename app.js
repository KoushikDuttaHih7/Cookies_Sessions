const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://Koushik-Shop:koushik.shop@cluster-shop.yyknzpb.mongodb.net/shop-cookies";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const port = 5000;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// resave: false -> this means that the session will not be saved on every request
// that is done, so on every response that is sent but only if
// something changed in the session., this will obviously improve performance and so on.

// saveUninitialized: false -> this will also basically ensure that no session gets saved for a request where
// it doesn't need to be saved because nothing waschanged about it

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
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
  .connect(MONGODB_URI)
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

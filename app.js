/**
 * Twitter to Call
 * @author Takenori Nakagawa
 */

var express = require("express"),
    flash = require("connect-flash"),
    hogan = require("hogan-express"),
    passport = require("passport"),
    twilio = require("twilio"),
    http = require("http"),
    path = require("path"),
    libs = require("./libs"),
    routes = require("./routes"),
    models = require("./models");

var app = express();
app.configure(function () {
  app.disable("x-powered-by");
  app.set("port", process.env.PORT || 61311);
  app.set("token", ~~(Math.random() * Math.pow(10, 8)));

  // render settings
  app.set("views", path.resolve(__dirname, "views"));
  app.set("view engine", "html");
  app.engine("html", hogan);
  app.engine("xml", hogan);
  app.set("partials", {
    menu      : "partials/menu",
    modal     : "partials/modal",
    header    : "partials/header",
    footer    : "partials/footer"
  });
  app.locals({
    menu: function (title) {
      var active = title === this.template.split("/")[0] ? "active" : "";
      return active;
    },
    isLoggedIn: function () {
      return !! this.user;
    }
  });

  // logger
  app.use(express.logger("dev"));
  app.use(express.errorHandler());

  // static routings
  app.use(express.static(path.resolve(__dirname, "static")));

  // parser settings
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "ss;twtw:call"}));

  // passport settings
  app.use(passport.initialize());
  app.use(passport.session());

  // user data -> template
  app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
  });

  // connect flash
  app.use(flash());

  // csrf settings
  app.use(express.csrf());
  app.use(function (req, res, next) {
    // set csrf token
    res.locals.csrf_token = req.csrfToken();
    next();
  });

  // routings
  app.use(app.router);
});

http.createServer(app).listen(app.get("port"), function () {
  console.log("Twitter to Call Server Started.");
});

routes.call(app);

models.users.getAll(function (err, users) {
  if (err)
    return console.error(err);

  Object.keys(users).forEach(function (user_id_hex) {
    var user = users[user_id_hex];
    if (user.id && user.screen_name && user.key && user.secret)
      libs.watch.addUser(user);
    else
      console.error("invalid user data");
  });
});

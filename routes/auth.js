/**
 * auth.js
 *
 */

var models = require("../models"),
    libs = require("../libs");

var passport = require("passport"),
    TwitterStrategy = require("passport-twitter").Strategy,
    account = require("../account");

// session serializer, deserializer
passport.serializeUser(function(user, done) {
  done(null, user.id.toString(16));
});
passport.deserializeUser(models.users.get);

passport.use(new TwitterStrategy({
    consumerKey: account.twitter.key,
    consumerSecret: account.twitter.secret,
    callbackURL: account.twitter.callback
  },
  function(key, secret, profile, done) {
    var user_id_hex = profile._json.id.toString(16);
    var user = {
      id: profile._json.id,
      screen_name: profile._json.screen_name,
      profile_image_url: profile._json.profile_image_url,
      key: key,
      secret: secret
    };

    models.users.set(user_id_hex, user, function (err, user) {
      libs.watch.addUser(user, key, secret);
      done(err, user);
    });
  }
));

module.exports = function () {
  var app = this;

  // check authenticate session
  app.get("/auth", function (req, res, next) {
    req.flash("authenticate");
    req.flash("authenticate", app.get("token"));
    next();
  });
  app.get("/auth/callback", function (req, res, next) {
    if (req.flash("authenticate")[0] === app.get("token"))
      return next();

    req.flash("error", {message: "予期せぬ認証エラー。再認証してください。"});
    res.redirect("/");
  });

  // twitter auth
  app.get("/auth", passport.authenticate("twitter"));
  app.get("/auth/callback", passport.authenticate("twitter", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/fail",
    failureFlash: true
  }));

  // authentication failure
  app.get("/auth/fail", function (req, res) {
    console.log(req.flash("error"));
    req.flash("error", {message: "認証失敗"});
    res.redirect("/");
  });

  // logout
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
};

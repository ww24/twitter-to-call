/**
 * dashboard.js
 *
 */

module.exports = function () {
  var app = this;

  app.get("/dashboard", function (req, res) {
    res.locals({
      template: "dashboard/index"
    });

    if (! req.user)
      res.redirect("/auth");

    res.render(res.locals.template);
  });
};

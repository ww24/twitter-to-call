/**
 * about.js
 *
 */

module.exports = function () {
  var app = this;

  app.get("/about", function (req, res) {
    res.locals({
      template: "about/index"
    });

    res.render(res.locals.template);
  });
};

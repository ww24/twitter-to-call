/**
 * routes
 *
 */

var libs = require("../libs");

module.exports = function () {
  var app = this;

  app.get("/", function (req, res) {
    res.locals({
      template: "index"
    });

    res.render(res.locals.template);
  });

  libs.loader.call(app, __dirname, null);
};

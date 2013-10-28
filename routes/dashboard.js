/**
 * dashboard.js
 *
 */

var models = require("../models");

module.exports = function () {
  var app = this;

  app.get("/dashboard", function (req, res) {
    res.locals({
      template: "dashboard/index",
      phones: [],
      logs: []
    });

    if (! req.user)
      return res.redirect("/auth");

    var user_id_hex = req.user.id.toString(16);
    models.phones.getAllNumbers(user_id_hex, function (err, phones) {
      if (err) {
        res.send(500);
        return console.error(err);
      }

      // 電話番号一覧
      res.locals.phones = Object.keys(phones).map(function (target, index) {
        var phone = phones[target];
        phone.id = index + 1;
        phone.target = target;
        return phone;
      });

      // 通話ログ
      models.logs.getAll(user_id_hex, function (err, logs) {
        res.locals.logs = logs.map(function (log, index) {
          console.log(log);
          log.id = index;
          return log;
        });

        res.render(res.locals.template);
      });
    });
  });
};

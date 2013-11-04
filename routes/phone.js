/**
 * phone.js
 *
 */

var libs = require("../libs"),
    models = require("../models");

module.exports = function () {
  var app = this;

  app.post("/phone/add", function (req, res) {
    if (! req.xhr)
      return res.send(400, {
        status: "ng",
        error: "Bad Request"
      });

    if (! req.user)
      return res.send(401, {
        status: "ng",
        error: "Unauthorized"
      });

    if (typeof req.body.name !== "string" || typeof req.body.number !== "string")
      return res.send(400, {
        status: "ng",
        error: "Bad Request"
      });

    var validator = new libs.Validator();
    validator.check(req.body.name, "名前に空白文字は含められません").notRegex(/\s/);
    validator.check(req.body.number, "電話番号はハイフン無しの数字で指定します").isNumeric();

    var errors = validator.getErrors();
    if (errors.length > 0) {
      return res.send(400, {
        status: "validation error",
        error: errors
      });
    }

    var user_id_hex = req.user.id.toString(16);
    var phone = {
      target: req.body.name,
      number: "+81" + req.body.number,
      certified: false
    };
    models.phones.setNumber(user_id_hex, phone, function (err, status) {
      if (err) {
        console.error(err);
        return res.send(500);
      }

      res.send({
        status: "ok"
      });
    });
  });

  app.post("/phone/del/:target", function (req, res) {
    if (! req.xhr)
      return res.send(400, {
        status: "ng",
        error: "Bad Request"
      });

    if (! req.user)
      return res.send(401, {
        status: "ng",
        error: "Unauthorized"
      });

    var user_id_hex = req.user.id.toString(16);
    models.phones.delNumber(user_id_hex, req.params.target, function (err, status) {
      if (err) {
        console.error(err);
        return res.send(500);
      }

      res.send({
        status: "ok"
      });
    });
  });
};

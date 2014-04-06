/**
 * twilio.js
 * 電話番号認証, 通話終了イベント, 発信用フォーマット
 */

var twilio = require("twilio"),
    models = require("../models");

module.exports = function () {
  var app = this;

  // 電話番号認証
  app.post("/TwiML/callback.xml", function (req, res) {
    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    res.locals({
      template: "TwiML/callback.xml"
    });

    res.render(res.locals.template);
  });
  app.post("/TwiML/verify", function (req, res) {
    var digits = req.body.Digits,
        resp = new twilio.TwimlResponse();

    var message = "認証コード " + digits + " は正しくありません。";
    if (false/*認証チェック*/) {
      message = "認証成功しました。";
    }

    resp.say(message, {
      voice: "alice",
      language: "ja-JP"
    });

    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    res.send(resp.toString());
  });

  // 通話終了時 Event
  app.post("/TwiML/calldone", function (req, res) {
    // debug request body
    console.log(req.body);

    models.logs.events.get(req.body.CallSid, function (err, log_info) {
      if (err) {
        res.send(500);
        return console.error(err);
      }

      if (! log_info) {
        res.send(500);
        return console.error("log_info is null");
      }

      models.logs.get(log_info.user_id_hex, log_info.index, function (err, log) {
        log.status = 1;
        log.end = Date.now();

        models.logs.set(log_info.user_id_hex, log_info.index, log, function (err, reply) {
          res.send(200);
        });
      });
    });
  });

  // 発信用 XML
  app.post("/TwiML/call.xml", function (req, res) {
    if (! req.query.msg)
      return res.send(500);

    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    res.locals({
      template: "TwiML/call.xml",
      message: req.query.msg
    });

    res.render(res.locals.template);
  });
};

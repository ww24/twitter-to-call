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
    var from = req.body.From;

    // invalid format
    if (typeof from !== "string")
      return res.send(400);

    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    var hour = new Date().getHours(),
        greeting = "こんにちは。";
    if (4 <= hour && hour < 11) {
      greeting = "おはようございます。";
    } else if (18 <= hour || hour < 4) {
      greeting = "こんばんは。";
    }

    console.log("From: ", req.body.From);

    res.locals({
      template: "TwiML/callback.xml",
      // 通知, 非通知(ANONYMOUS) チェック
      valid_number: from !== "+266696687",
      greeting: greeting
    });

    res.render(res.locals.template);
  });
  app.post("/TwiML/verify", function (req, res) {
    var digits = req.body.Digits,
        resp = new twilio.TwimlResponse();

    // "0896" -> "0 8 9 6"
    var digits_message = digits.split("").join(" ");

    var message = "認証コード " + digits_message + " は正しくありません。";
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

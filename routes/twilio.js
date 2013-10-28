/**
 * twilio.js
 * 電話番号認証, 通話終了イベント, 発信用フォーマット
 */

var models = require("../models");

module.exports = function () {
  var app = this;

  // 電話番号認証
  app.post("/TwiML/default.xml", function (req, res) {
    
  });

  // 通話終了時 Event
  app.post("/TwiML/calldone", function (req, res) {
    // debug request body
    console.log(req.body);

    if (! req.body.CallSid) {
      res.end(500);
      return console.error("CallSid is undefined.");
    }

    models.logs.events.get(req.body.CallSid, function (err, log_info) {
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
    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    if (! req.query.msg)
      return res.send(500);

    res.locals({
      message: req.query.msg
    });

    // debug get queries
    console.log(req.query);

    res.render("TwiML/call.xml");
  });
};

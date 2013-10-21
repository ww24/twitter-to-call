/**
 * twilio.js
 *
 */

var twilio = require("twilio"),
    account = require("../account");

twilio = twilio(account.twilio.sid, account.twilio.token);

module.exports = function () {
  var app = this;

  var callData = {/*
    CallSid: Date.now() (is connecting?)
  */};

  app.post("/TwiML/callback.xml", function (req, res) {
    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    res.locals({
      greeting: "こんにちは。"
    });

    // debug request body
    console.log(req.body);
    if (req.body.CallSid)
      callData[req.body.CallSid] = Date.now();
    else
      console.error("CallSid is undefined.");

    // get time for greeting
    var time = new Date().getHours();
    if (4 <= time && time < 11)
      res.locals.greeting = "おはようございます。";
    else (17 <= time && time < 4)
      res.locals.greeting = "こんばんは。";

    res.render("TwiML/callback.xml");
  });

  app.post("/TwiML/calldone", function (req, res) {
    // debug request body
    console.log(req.body);
    
    var startTime,
        endTime = Date.now();

    if (req.body.CallSid)
      startTime = callData[req.body.CallSid];
    else
      console.error("CallSid is undefined.");

    console.log("call time:" + ((endTime - startTime) / 1000) + "sec.");

    res.send(200);
  });

  app.post("/TwiML/call.xml", function (req, res) {
    // set XML Content-Type header
    res.set("Content-Type", "application/xml; charset=utf-8");

    res.locals({
      message: "こんばんは。明日の天気は荒れ模様です。"
    });

    // debug get queries
    console.log(req.query);

    res.render("TwiML/call.xml");
  });

  app.post("/twilio/call/:to/:from", function (req, res) {

    if (! req.user)
      res.send(400);

    twilio.calls.create({
      url: "http://tw2c.appcloud.info/TwiML/call.xml",
      to: req.params.to,
      from: req.params.from
    }, function (err, call, res) {
      if (err)
        console.error(err);

      res.json(call);
    });
  });
};

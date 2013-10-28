/**
 * call.js
 * Twilio API
 */

var twilio = require("twilio"),
    account = require("../account"),
    models = require("../models");

twilio = twilio(account.twilio.sid, account.twilio.token);

module.exports = function (user_id_hex, number, message, callback) {
  twilio.calls.create({
    url: "http://tw2c.appcloud.info/TwiML/call.xml?msg=" + encodeURIComponent(message),
    StatusCallback: "http://tw2c.appcloud.info/TwiML/calldone",
    to: number,
    from: account.twilio.number
  }, function (err, call, res) {
    if (err)
      console.error(err);
    
    var log = {
      to: number,
      msg: message
    };

    models.logs.add(user_id_hex, log, function (err, index) {
      var log_info = {
        user_id_hex: user_id_hex,
        index: index
      };

      models.logs.events.set(call.sid, log_info);
    });
  });
};

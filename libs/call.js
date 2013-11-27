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
    url: account.url + "/TwiML/call.xml?msg=" + encodeURIComponent(message),
    StatusCallback: account.url + "/TwiML/calldone",
    to: number,
    from: account.twilio.number
  }, function (err, call, res) {
    var log = {
      to: number,
      msg: message
    };

    if (err) {
      log.error = JSON.stringify(err);
      models.logs.add(user_id_hex, log, function (err, index) {
        if (err)
          return console.error(err);
        /* エラーログなので models.logs.events.set は不要 */
      });
      return console.error(err);
    }

    models.logs.add(user_id_hex, log, function (err, index) {
      var log_info = {
        user_id_hex: user_id_hex,
        index: index
      };

      models.logs.events.set(call.sid, log_info);
    });
  });
};

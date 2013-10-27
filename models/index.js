/**
 * Models
 *
 */

var redis = require("redis"),
    libs = require("../libs");

module.exports = (function () {
  var clients = ["users", "phones", "logs"];
  
  clients = clients.map(function (name, index) {
    var client = redis.createClient();

    client.select(index);
    client.on("error", function (err) {
      console.error("DB Error: " + err);
    });
    
    return client;
  });

  clients[0].on("connect", function () {
    // DB schema

    // users
    clients[0].hset("users", "user_id_hex", JSON.stringify({
      id: 2372453403909323,
      screen_name: "hoge",
      token: "twitter_access_token",
      secret: "twitter_access_token_secret"
    }), function () {
      models.users.get("user_id_hex", function (err, data) {
        if (err)
          return console.error(err);

        console.log(data);
      });
    });

    // phone numbers
    clients[1].hset("user_id_hex", "母", JSON.stringify({
      number: "+819012345678"
    }), function () {
      models.phones.getNumbers("user_id_hex", function (err, data) {
        if (err)
          return console.error(err);

        console.log(data);
      });
    });

    // logs
    clients[2].lpush("user_id_hex", JSON.stringify({
      timestamp: Date.now(),
      to: "+819012345678",
      msg: "メッセージ",
      time: 300 //ms
    }), function () {
      models.logs.get("user_id_hex", function (err, data) {
        if (err)
          return console.error(err);

        console.log(data);
      });
    });
  });

  var models = libs.loader.call(clients, __dirname, null);
  return models;
})();

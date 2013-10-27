/**
 * users.js
 * ユーザ情報
 */

var models = require("./");

module.exports = function () {
  var client = this[0],
      model = {};

  model.get = function (id, callback) {
    client.hget("users", id, function (err, reply) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      reply = JSON.parse(reply);

      callback(null, reply);
    });
  };

  model.set = function (id, user, callback) {
    if (typeof user.id !== "number")
      throw new TypeError("user.id must be number.");
    if (typeof user.screen_name !== "string")
      throw new TypeError("user.screen_name must be string.");
    if (typeof user.token !== "string")
      throw new TypeError("user.token must be string.");
    if (typeof user.secret !== "string")
      throw new TypeError("user.secret must be string.")

    client.hset("users", id, JSON.stringify({
      id: user.id,
      screen_name: user.screen_name,
      token: user.token,
      secret: user.secret
    }), function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      callback && callback(null, reply);
    });
  };

  model.del = function (id, callback) {
    client.hdel("users", id, function (err, reply) {
      if (err) {
        console.log(err);
        return callback && callback(err);
      }

      models.logs.delAll();
      models.phones.delAll();
      callback && callback(null, reply);
    });
  };

  return model;
};

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

      if (! reply)
        return callback(null, null);

      reply = JSON.parse(reply);

      callback(null, reply);
    });
  };

  model.getAll = function (callback) {
    client.hgetall("users", function (err, replies) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      if (! replies)
        return callback(null, {});

      Object.keys(replies).forEach(function (target) {
        replies[target] = JSON.parse(replies[target]);
      });

      callback(null, replies);
    });
  };

  model.set = function (id, user, callback) {
    if (typeof user.id !== "number")
      throw new TypeError("user.id must be number.");
    if (typeof user.screen_name !== "string")
      throw new TypeError("user.screen_name must be string.");
    if (typeof user.profile_image_url !== "string")
      throw new TypeError("user.profile_image_url must be string.");
    if (typeof user.key !== "string")
      throw new TypeError("user.key must be string.");
    if (typeof user.secret !== "string")
      throw new TypeError("user.secret must be string.")

    model.get(id, function (err, reply) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      if (reply)
        user.command || (user.command = reply.command);

      user = {
        id: user.id,
        screen_name: user.screen_name,
        profile_image_url: user.profile_image_url,
        key: user.key,
        secret: user.secret,
        command: user.command || ["call:"]
      };

      client.hset("users", id, JSON.stringify(user), function (err, reply) {
        if (err) {
          console.error(err);
          return callback && callback(err);
        }

        callback && callback(null, user);
      });
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

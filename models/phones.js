/**
 * phones.js
 * 電話番号
 */

module.exports = function () {
  var client = this[1],
      model = {};

  model.getNumber = function (id, target, callback) {
    client.hget(id, target, function (err, reply) {
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

  model.getAllNumbers = function (id, callback) {
    client.hgetall(id, function (err, replies) {
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

  model.setNumber = function (id, phone, callback) {
    if (typeof phone.target !== "string")
      throw new TypeError("phone.target must be string.");
    if (typeof phone.number !== "string")
      throw new TypeError("phone.number must be string.");
    if (typeof phone.certified !== "boolean")
      throw new TypeError("phone.certified must be boolean");

    client.hset(id, phone.target, JSON.stringify({
      number: phone.number,
      certified: phone.certified
    }), function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      callback && callback(null, reply);
    });
  };

  model.delNumber = function (id, target, callback) {
    client.hdel(id, target, function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      callback && callback(null, reply);
    });
  };

  model.delAll = function () {
    client.del(id, function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      callback && callback(null, reply);
    });
  };

  return model;
};

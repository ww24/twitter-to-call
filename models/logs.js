/**
 * logs.js
 * 通話終了時ログ
 */

module.exports = function () {
  var client = this[2],
      model = {};

  model.get = function (id, callback) {
    client.lrange(id, 0, -1, function (err, replies) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      replies = replies.map(JSON.parse);

      callback(null, replies);
    });
  };

  model.set = function (id, log, callback) {
    client.lpush(id, JSON.stringify(log), function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      callback && callback(null, reply);
    });
  };

  model.del = function (id, index, calback) {
    client.lindex(id, index, function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      client.lrem(id, 1, reply, function (err, reply) {
        if (err) {
          console.error(err);
          return callback && callback(err);
        }

        callback && callback(null, reply);
      });
    });
  };

  model.delAll = function (id, callback) {
    client.del(id, function (err, reply) {
      if (err) {
        console.log(err);
        return callback && callback(err);
      }

      callback(null, reply);
    });
  };

  return model;
};

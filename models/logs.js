/**
 * logs.js
 * 通話終了時ログ
 */

module.exports = function () {
  var client = this[2],
      model = {};

  model.get = function (id, index, callback) {
    client.lindex(id, index, function (err, reply) {
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

  model.getAll = function (id, callback) {
    client.lrange(id, 0, -1, function (err, replies) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      if (! replies)
        return callback(null, []);

      replies = replies.map(JSON.parse);

      callback(null, replies);
    });
  };

  model.add = function (id, log, callback) {
    if (typeof log.to !== "string")
      throw new TypeError("log.to must be string");
    if (typeof log.msg !== "string")
      throw new TypeError("log.msg must be string");

    log = {
      status: 0,
      start: Date.now(),
      end: 0, // for index
      to: log.to,
      msg: log.msg
    };

    client.lpush(id, JSON.stringify(log), function (err, reply) {
      if (err) {
        console.error(err);
        return callback && callback(err);
      }

      var index = reply - 1;
      log.end = index;

      model.set(id, index, log, function (err, reply) {
        if (err)
          return callback && callback(err);

        callback && callback(null, index);
      });
    });
  };

  model.set = function (id, index, log, callback) {
    if (typeof log.status !== "number")
      throw new TypeError("log.status must be number");
    if (typeof log.start !== "number")
      throw new TypeError("log.start must be number");
    if (typeof log.end !== "number")
      throw new TypeError("log.end must be number");
    if (typeof log.to !== "string")
      throw new TypeError("log.to must be string");
    if (typeof log.msg !== "string")
      throw new TypeError("log.msg must be string");

    log = {
      status: log.status,
      start: log.start,
      end: log.eng,
      to: log.to,
      msg: log.msg
    };

    client.lset(id, index, JSON.stringify(log), function (err, reply) {
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

      callback && callback(null, reply);
    });
  };

  // 通話 Event
  model.events = {};
  model.events.get = function (sid) {
    client.hget("CallSid", sid, function (err, log_info) {
      if (err) {
        console.log(err);
        return callback && callback(err);
      }

      if (! log_info)
        return callback && callback(null, null);

      log_info = JSON.parse(log_info);

      client.hdel("CallSid", sid, function (err, reply) {
        if (err) {
          console.log(err);
          return callback && callback(err);
        }

        callback && callback(null, log_info);
      })
    });
  };
  model.events.set = function (sid, log_info, callback) {
    if (log_info.user_id_hex !== "string")
      throw new TypeError("log_info.user_id_hex must be string");
    if (log_info.index !== "number")
      throw new TypeError("log_info.index must be number");

    client.hset("CallSid", sid, JSON.stringify(log_info), function (err, reply) {
      if (err) {
        console.log(err);
        return callback && callback(err);
      }

      callback && callback(null, reply);
    });
  };

  return model;
};

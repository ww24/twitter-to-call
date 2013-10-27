/**
 * watch.js
 * TL watcher
 */

var Twitter = require("ntwitter"),
    account = require("../account.json");

var user_streames = {};

exports.addUser = function (user) {
  if (typeof user.id !== "number")
    throw new TypeError("user.id must be number.");
  if (typeof user.screen_name !== "string")
    throw new TypeError("user.screen_name must be string.");
  if (typeof user.key !== "string")
    throw new TypeError("user.key must be string.");
  if (typeof user.secret !== "string")
    throw new TypeError("user.secret must be string.")

  if (user_streames[user.id])
    return user_streames[user.id];

  var twitter = new Twitter({
    consumer_key: account.twitter.key,
    consumer_secret: account.twitter.secret,
    access_token_key: user.key,
    access_token_secret: user.secret
  });

  var user_stream = user_streames[user.id] = {
    twitter: twitter,
    screen_name: user.screen_name,
    command: user.command,
    events: []
  };

  twitter.stream("user", {with: "user"}, function (stream) {
    count = 16;
    stream.on("data", function (tweet) {
      // ツイート判定
      if (! tweet.text)
        return;
      // 自分以外のツイート除去 (Reply 等)
      if (tweet.user.id !== user.id)
        return;
      // RT 除去
      if (tweet.retweeted_status)
        return;

      var splitTweet = tweet.text.trim().split(user_stream.command[0]);
      if (splitTweet[0] !== "")
        return;

      splitTweet = splitTweet[1].trim().match(/([\S]+)\s+([^]+)/);
      if (! splitTweet || splitTweet.length !== 3)
        return;

      var to = splitTweet[1],
          msg = splitTweet[2];

      console.log("to: " + to + ", message: " + msg);
      /* to -> 電話番号変換処理 */
      /* 発信処理 */
    });

    stream.on("end", function () {
      console.log(arguments);
      /* 再接続処理 */
    });

    stream.on("destroy", function () {
      console.log(arguments);
      /* 後片付け */
    });

    stream.on("error", function () {
      console.error(arguments);
    });
  });

  return user_stream;
};

exports.delUser = function () {

};

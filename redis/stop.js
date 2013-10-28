/**
 * stop.js
 * shutdown redis-server
 */

var account = require("../account.json"),
    cp = require("child_process");

console.log("redis-cli shutdown");

cp.exec([
  "redis-cli",
  "-p", account.redis.port,
  "-h", account.redis.host,
  "-a", account.redis.pass,
  "shutdown"
].join(" "), function (err, stdout, stderr) {
  if (err)
    return console.error(err);

  console.log(stdout);
  console.error(stderr);
});

/**
 * Module Auto Loader
 * libs/loader.js
 */

var fs = require("fs"),
    path = require("path");

// module autoloader
module.exports = function (dir) {
  var args = [].slice.call(arguments, 1),
      modules = fs.readdirSync(dir),
      mod = {},
      that = this;

  modules.forEach(function (module) {
    if (module.slice(-3) !== ".js" || module === "index.js")
      return false;

    var name = module.slice(0, -3),
        func = require(path.resolve(path.join(dir, name)));

    mod[name] = args.length > 0 ? func.apply(that, args) : func;
  });

  return mod;
};

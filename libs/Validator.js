/**
 * Validator
 * libs/Validator.js
 */

var validator = require("validator"),
    Validator = validator.Validator;

// Validator settings
Validator.prototype.error = function (msg) {
  this._errors.push(msg);
  return this;
};
Validator.prototype.getErrors = function () {
  return this._errors;
};

module.exports = Validator;

"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_mail["default"].setApiKey(functions.config().sendgrid.api_key);

_mail["default"].emailAdmin = function (_ref) {
  var subject = _ref.subject,
      text = _ref.text,
      html = _ref.html;
  // TODO Fix: this doesn't seem to be working; should have fired in the catch block..
  var msg = {
    to: 'ethan@vertua.com',
    from: 'ethan@vertua.com',
    subject: subject,
    text: text,
    html: html
  };

  try {
    _mail["default"].send(msg);
  } catch (err) {
    console.error("Error sending email notification: ", err);
  }
};

_mail["default"].sendAdminErrorNotice = function (userRecord) {
  _mail["default"].emailAdmin({
    subject: '[Error] Error Adding User',
    text: "[Error] A user signed up but a new user record was not created. Fix manually: ".concat(userRecord),
    html: "\n\t\t\t<div>\n\t\t\t\t<h1>Error Adding User</h1>\n\t\t\t\t<div>".concat(userRecord, "</div>\n\t\t\t\t<hr/>\n\t\t\t\t<div>Fix manually</div>\n\t\t\t</div>\n\t\t")
  });
};

_mail["default"].sendAdminSuccessNotice = function (userRecord) {
  _mail["default"].emailAdmin({
    subject: '[New User] Vertua',
    text: "A new user has joined Vertua: ".concat(userRecord),
    html: "\n\t\t\t<div>\n\t\t\t\t<h1>A new user has joined Vertua</h1>\n\t\t\t\t<div>\n\t\t\t\t\t".concat(userRecord, "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t")
  });
};

var _default = _mail["default"];
exports["default"] = _default;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onAccountCreate = void 0;

require("babel-polyfill");

var admin = _interopRequireWildcard(require("firebase-admin"));

var functions = _interopRequireWildcard(require("firebase-functions"));

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = admin.initializeApp();

_mail["default"].setApiKey(functions.config().sendgrid.api_key); // -----------------------
// 	Accounts
// -----------------------


var onAccountCreate = functions.auth.user().onCreate( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userRecord, context) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("userRecord: ", userRecord);
            user = {
              uid: userRecord.uid,
              displayName: userRecord.displayName || '',
              photoURL: userRecord.photoURL || '',
              visibilty: 'public',
              createdAt: userRecord.metadata.createdAt
            };
            _context.prev = 2;
            _context.next = 5;
            return app.firestore().collection('users').doc(userRecord.uid).set(user);

          case 5:
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);
            sendErrorNotificationToAdmin();

          case 11:
            sendSuccessNotificationToAdmin();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // --------------------------
// Utils
// --------------------------
// TODO Fix: this doesn't seem to be working; should have fired in the catch block..

exports.onAccountCreate = onAccountCreate;

function sendEmailToAdmin(_ref2) {
  var text = _ref2.text,
      html = _ref2.html,
      subject = _ref2.subject;
  var msg = {
    to: 'ethan@vertua.com',
    from: 'ethan@vertua.com',
    subject: subject,
    text: text,
    html: html
  };

  _mail["default"].send(msg);
}

function sendErrorNotificationToAdmin() {
  sendEmailToAdmin({
    subject: '[Error] Error Adding User',
    text: "[Error] A user signed up but a new user record was not created. Fix manually: ".concat(userRecord),
    html: "\n\t\t\t<div>\n\t\t\t\t<h1>Error Adding User</h1>\n\t\t\t\t<div>".concat(userRecord, "</div>\n\t\t\t\t<hr/>\n\t\t\t\t<div>Fix manually</div>\n\t\t\t</div>\n\t\t")
  });
}

function sendSuccessNotificationToAdmin() {
  sendEmailToAdmin({
    subject: '[New User] Vertua',
    text: "A new user has joined Vertua: ".concat(userRecord),
    html: "\n\t\t\t<div>\n\t\t\t\t<h1>A new user has joined Vertua</h1>\n\t\t\t\t<div>\n\t\t\t\t\t".concat(userRecord, "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t")
  });
} // TODO onAccountDelete()
// - remove from search index
// -----------------------
// 	Users
// -----------------------
// const onUserCreate = functions.firestore.
// 	document('users/{userId}')
// 	.onCreate(async (snapshot, context) => {
// 		// TODO Add to search index
// 	}) 
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
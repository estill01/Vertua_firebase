"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _algoliasearch = _interopRequireDefault(require("algoliasearch"));

var _requesterNodeHttp = require("@algolia/requester-node-http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// -------------------------------
// 	Core
// -------------------------------
var AlgoliaSearch = {};
AlgoliaSearch.client = (0, _algoliasearch["default"])( //const client = Algolia(
functions.config().algolia.app_id, functions.config().algolia.admin_key, {
  requester: (0, _requesterNodeHttp.createNodeHttpRequester)()
}); // -------------------------------
// 	Indexes
// -------------------------------

AlgoliaSearch.index = {};
AlgoliaSearch.index.users = AlgoliaSearch.client.initIndex('users');
AlgoliaSearch.index.users.setSettings({
  searchableAttributes: ['displayName', 'createdAt', 'uid']
});
AlgoliaSearch.index.projects = AlgoliaSearch.client.initIndex('projects');
AlgoliaSearch.index.projects.setSettings({
  searchableAttributes: ['name', 'description', 'creator', 'createdAt', 'uid']
});

function _buildDocFromFirebaseRecord(_x, _x2) {
  return _buildDocFromFirebaseRecord2.apply(this, arguments);
} // -------------------------------
// 	Utils
// -------------------------------


function _buildDocFromFirebaseRecord2() {
  _buildDocFromFirebaseRecord2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(record, searchIndex) {
    var doc, settings, attrsArr;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("[_buildDocFromFirebaseRecord] START");
            doc = {};
            _context3.next = 4;
            return AlgoliaSearch.index[searchIndex].getSettings();

          case 4:
            settings = _context3.sent;
            attrsArr = settings.searchableAttributes;
            attrsArr.forEach(function (attr) {
              var arr = Object.values(record._fieldsProto[attr]); // array

              if (arr.length > 0 && arr.length < 2) {
                doc[attr] = arr[0];
              } else {
                doc[attr] = arr;
              }
            }); // _fieldsProto<Map<Map>> = {
            // 	key: { type: value },
            // 	key: { type: value },
            // }

            doc.objectID = record._fieldsProto.uid.stringValue; // console.log("[_buildDocFromFirebaseRecord] record._fieldsProto:", record._fieldsProto)
            // console.log("[_buildDocFromFirebaseRecord] record._fieldsProto.uid:", record._fieldsProto.uid)
            // console.log("[_buildDocFromFirebaseRecord] settings:", settings)
            // console.log("[_buildDocFromFirebaseRecord] attrsArr:", attrsArr)
            // console.log("[_buildDocFromFirebaseRecord] doc: ", doc)
            // console.log("[_buildDocFromFirebaseRecord] doc.objectID: ", doc.objectID)

            console.log("[_buildDocFromFirebaseRecord] END");
            return _context3.abrupt("return", doc);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _buildDocFromFirebaseRecord2.apply(this, arguments);
}

AlgoliaSearch.addDocToIndex = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(doc, index) {
    var _result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("[addDocToIndex] START");
            console.log("[addDocToIndex] Using index:", AlgoliaSearch.index[index].indexName);
            console.log("[addDocToIndex] doc._fieldsProto:", doc._fieldsProto);
            console.log("[addDocToIndex] doc._fieldsProto.uid:", doc._fieldsProto.uid);
            console.log("[addDocToIndex] doc._fieldsProto.uid.stringValue:", doc._fieldsProto.uid.stringValue);
            _context.next = 7;
            return _buildDocFromFirebaseRecord(doc, index);

          case 7:
            doc = _context.sent;
            _context.prev = 8;
            _context.next = 11;
            return AlgoliaSearch.index[index].saveObject(doc);

          case 11:
            _result = _context.sent;
            console.log("[addDocToIndex] result: ", _result);
            console.log("[addDocToIndex] END");
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](8);
            console.error(_context.t0);
            throw new Error("[AlgoliaSearch.addDocToIndex] ");

          case 20:
            return _context.abrupt("return", result);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 16]]);
  }));

  return function (_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

AlgoliaSearch.removeIDFromIndex = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, index) {
    var _result2;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return AlgoliaSearch.index[index].deleteObject(id);

          case 3:
            _result2 = _context2.sent;
            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);
            throw new Error("[AlgoliaSearch.removeIDFromIndex]");

          case 10:
            return _context2.abrupt("return", result);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6]]);
  }));

  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = AlgoliaSearch;
exports["default"] = _default;
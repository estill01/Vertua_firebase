"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var functions = _interopRequireWildcard(require("firebase-functions"));

var _algoliasearch = _interopRequireDefault(require("algoliasearch"));

var _requesterNodeHttp = require("@algolia/requester-node-http");

var _lodash = require("lodash");

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
  searchableAttributes: ['displayName', 'createdAt', 'uid'],
  attributesToRetrieve: ['displayName', 'createdAt', 'uid', 'photoURL']
});
AlgoliaSearch.index.projects = AlgoliaSearch.client.initIndex('projects');
AlgoliaSearch.index.projects.setSettings({
  searchableAttributes: ['name', 'description', 'creator', 'createdAt', 'uid'],
  attributesToRetrieve: ['name', 'description', 'creator', 'createdAt', 'uid']
}); // async function _buildDocFromFirebaseRecord(record, searchIndex) {
// 	console.log("[_buildDocFromFirebaseRecord] START")
// 	// console.log("doc: ", doc)
// 	
// 	// _fieldsProto<Map<Map>> = {
// 	// 	key: { type: value },
// 	// 	key: { type: value },
// 	// }
//
// 	throw new Error("TEMPORARY -- Need to revamp '_buildDocFromFirebaseRecord'")
//
// 	// -- TEMPORAR --
// 	// const doc = {}
// 	// const settings = await AlgoliaSearch.index[searchIndex].getSettings()
// 	// const attrsArr = union(settings.searchableAttributes, settings.attributesToRetrieve)
//   //
// 	// attrsArr.forEach((attr) => { 
// 	// 	let arr = Object.values(record._fieldsProto[attr]) 
// 	// 	if (arr.length > 0 && arr.length < 2) { doc[attr] = arr[0] }
// 	// 	else { doc[attr] = arr }
// 	// })
//   //
// 	// doc.objectID = record._fieldsProto.uid.stringValue
//   //
// 	// console.log("[_buildDocFromFirebaseRecord] END")
//   //
// 	// return doc
// }
// -------------------------------
// 	Utils
// -------------------------------

AlgoliaSearch.addDocToIndex = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(doc, index) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("[addDocToIndex] START");
            console.log("[addDocToIndex] Using index:", AlgoliaSearch.index[index].indexName);
            console.log("[addDocToIndex] doc:", doc); // console.log("[addDocToIndex] doc._fieldsProto:", doc._fieldsProto)
            // doc = await _buildDocFromFirebaseRecord(doc,index)

            doc.objectID = doc.uid;
            _context.prev = 4;
            _context.next = 7;
            return AlgoliaSearch.index[index].saveObject(doc);

          case 7:
            result = _context.sent;
            console.log("[addDocToIndex] result: ", result);
            console.log("[addDocToIndex] END");
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](4);
            console.error(_context.t0);
            throw new Error("[AlgoliaSearch.addDocToIndex] ");

          case 16:
            return _context.abrupt("return", result);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 12]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

AlgoliaSearch.removeIDFromIndex = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, index) {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("[AlgoliaSearch.removeIDFromIndex]");
            console.log("[AlgoliaSearch.removeIDFromIndex] id: ", id);
            console.log("[AlgoliaSearch.removeIDFromIndex] index: ", index);
            _context2.prev = 3;
            _context2.next = 6;
            return AlgoliaSearch.index[index].deleteObject(id);

          case 6:
            result = _context2.sent;
            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](3);
            console.error(_context2.t0);
            throw new Error("[AlgoliaSearch.removeIDFromIndex]");

          case 13:
            return _context2.abrupt("return", result);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 9]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = AlgoliaSearch;
exports["default"] = _default;
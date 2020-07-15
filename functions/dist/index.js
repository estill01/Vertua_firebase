"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onProjectDelete = exports.onProjectCreate = exports.onUserDelete = exports.onUserCreate = exports.onAccountDelete = exports.onAccountCreate = void 0;

require("babel-polyfill");

var admin = _interopRequireWildcard(require("firebase-admin"));

var functions = _interopRequireWildcard(require("firebase-functions"));

var _services = require("./services");

var _lodash = require("lodash");

var _nanoid = require("nanoid");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = admin.initializeApp(); // -----------------------
// 	Accounts
// -----------------------

var onAccountCreate = functions.auth.user().onCreate( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userRecord, context) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = buildUserDoc(userRecord);
            _context.prev = 1;
            _context.next = 4;
            return app.firestore().collection('users').doc(userRecord.uid).set(user);

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            throw new Error("[onAccountCreate]");

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
exports.onAccountCreate = onAccountCreate;
var onAccountDelete = functions.auth.user().onDelete( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(userRecord, context) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return app.firestore().collection('users').doc(userRecord.uid)["delete"]();

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            throw new Error("[onAccountDelete]");

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 5]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()); // -----------------------
// 	Users
// -----------------------

exports.onAccountDelete = onAccountDelete;
var onUserCreate = functions.firestore.document('users/{userId}').onCreate( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(snapshot, context) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // onCreate : <QueryDocumentSnapshot>
            // handler : function(snapshot: <QueryDocumentSnapshot>, context: <EventContext>) : PromiseLike<any>
            console.log("[onUserCreate]");
            intakePipeline(snapshot, 'users');

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
exports.onUserCreate = onUserCreate;
var onUserDelete = functions.firestore.document('users/{userId}').onDelete( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(snapshot, context) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("[onUserDelete]");
            deletionPipeline(context.params.userId, 'users');

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()); // -----------------------
// 	Projects
// -----------------------

exports.onUserDelete = onUserDelete;
var onProjectCreate = functions.firestore.document('projects/{projectId}').onCreate( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(snapshot, context) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log("[onProjectCreate]");
            intakePipeline(snapshot, 'projects');

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
exports.onProjectCreate = onProjectCreate;
var onProjectDelete = functions.firestore.document('projects/{projectId}').onDelete( /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(snapshot, context) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("[onProjectDelete]");
            deletionPipeline(context.params.projectId, 'projects');

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()); // ===========================
// 	Utils 
// ===========================
// ---------------------------
// 	Utils : Intake Pipeline
// ---------------------------
// async function intakePipeline(snapshot, searchIndex) {
// 	if (isNil(snapshot)) { throw new Error('`intakePipeline()` parameter `snapshot` cannot be null') }
// 	if (isNil(searchIndex)) { throw new Error('`intakePipeline()` parameter `searchIndex` cannot be null') }
// 	let docRef = snapshot.ref 
// 	let data = snapshot.data()
// 	let promises = []
//
// 	addTimestamp(data)
//
// 	if (searchIndex !== 'users') { promises.push(addCreator(data)) }
// 	promises.push(addSlug(data, searchIndex))
//
// 	return Promise.all(promises).then(async (val) => {
// 		try { 
// 			await docRef.set(data) 
// 			if (!isNil(data.creator)) {
// 				if(!isNil(data.creator.docRef)) { delete data.creator.docRef }  // NB. was causing a circular reference error with algolia
// 			}
// 			await addDocToSearchIndex(data, searchIndex) 
// 		}
// 		catch (err) { 
// 			try { await app.firestore().collection(searchIndex).doc(data.uid).delete() } // Clean up created item (NB. This isn't working)
// 			catch (err) { throw new Error(err) }
// 			throw new Error(err) 
// 		}
// 		return
// 	})
// }

exports.onProjectDelete = onProjectDelete;

function intakePipeline(_x13, _x14) {
  return _intakePipeline.apply(this, arguments);
}

function _intakePipeline() {
  _intakePipeline = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(snapshot, searchIndex) {
    var docRef, data;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!(0, _lodash.isNil)(snapshot)) {
              _context7.next = 2;
              break;
            }

            throw new Error('`intakePipeline()` parameter `snapshot` cannot be null');

          case 2:
            if (!(0, _lodash.isNil)(searchIndex)) {
              _context7.next = 4;
              break;
            }

            throw new Error('`intakePipeline()` parameter `searchIndex` cannot be null');

          case 4:
            docRef = snapshot.ref;
            data = snapshot.data();
            _context7.prev = 6;
            _context7.next = 9;
            return Promise.all([addTimestamp(data), addCreator(data, searchIndex), addSlug(data, searchIndex)]);

          case 9:
            _cleanData(data);

            _context7.next = 12;
            return Promise.all([docRef.set(data), addDocToSearchIndex(data, searchIndex)]);

          case 12:
            _context7.next = 25;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](6);
            _context7.prev = 16;
            _context7.next = 19;
            return app.firestore().collection(searchIndex).doc(data.uid)["delete"]();

          case 19:
            _context7.next = 24;
            break;

          case 21:
            _context7.prev = 21;
            _context7.t1 = _context7["catch"](16);
            throw new Error(_context7.t1);

          case 24:
            throw new Error(_context7.t0);

          case 25:
            return _context7.abrupt("return");

          case 26:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[6, 14], [16, 21]]);
  }));
  return _intakePipeline.apply(this, arguments);
}

function _cleanData(data) {
  // NB. 'creator.docRef' was causing a circular reference error with Algolia indexing
  if (!(0, _lodash.isNil)(data.creator)) {
    if (!(0, _lodash.isNil)(data.creator.docRef)) {
      delete data.creator.docRef;
    }
  }
}

function addTimestamp(_x15) {
  return _addTimestamp.apply(this, arguments);
} // TODO Review for anonymous user case -- e.g. annonymous users 'urlSlug' is blank (?)


function _addTimestamp() {
  _addTimestamp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(data) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            data.createdAt = Date.now();

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _addTimestamp.apply(this, arguments);
}

function addCreator(_x16, _x17) {
  return _addCreator.apply(this, arguments);
}

function _addCreator() {
  _addCreator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(data, searchIndex) {
    var creator;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log("[addCreator]");

            if (!(searchIndex === 'users')) {
              _context9.next = 3;
              break;
            }

            return _context9.abrupt("return");

          case 3:
            creator = null;
            _context9.prev = 4;
            _context9.next = 7;
            return getUserRecord(data.creator.uid);

          case 7:
            creator = _context9.sent;
            _context9.next = 13;
            break;

          case 10:
            _context9.prev = 10;
            _context9.t0 = _context9["catch"](4);
            throw new Error(_context9.t0);

          case 13:
            // console.log("data.creator: ", data.creator)
            // console.log("data.creator.displayName: ", data.creator.displayName)
            data.creator.displayName = creator.displayName || '';
            data.creator.photoURL = creator.photoURL || '';
            data.creator.urlSlug = creator.urlSlug || '';

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[4, 10]]);
  }));
  return _addCreator.apply(this, arguments);
}

function addSlug(_x18, _x19) {
  return _addSlug.apply(this, arguments);
}

function _addSlug() {
  _addSlug = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(data, searchIndex) {
    var slug, slugTaken;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            slug = null;

            if (searchIndex === 'users') {
              if (data.displayName === '') {
                slug = data.uid;
              } // NB. To handle anonymous users which don't have a 'displayName' property.
              else {
                  slug = data.displayName;
                }
            } else {
              slug = data.name;
            }

            if (slug === '') {
              slug = data.uid;
            } // slug = slug.toLowerCase()


            slug = slug.replace(/ /gi, '_');
            slug = encodeURIComponent(slug);
            _context10.next = 7;
            return _slugTaken(slug, searchIndex);

          case 7:
            slugTaken = _context10.sent;

            if (!slugTaken) {
              _context10.next = 12;
              break;
            }

            _context10.next = 11;
            return _generateUniqueSlug(slug, searchIndex);

          case 11:
            slug = _context10.sent;

          case 12:
            data.urlSlug = '/' + searchIndex + '/' + slug;

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _addSlug.apply(this, arguments);
}

function _slugTaken(_x20, _x21) {
  return _slugTaken2.apply(this, arguments);
}

function _slugTaken2() {
  _slugTaken2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(slug, searchIndex) {
    var fullSlug, slugTaken;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.log("[_slugTaken]");
            fullSlug = '/' + searchIndex + '/' + slug;
            console.log("searching for: ", fullSlug);
            slugTaken = app.firestore().collection(searchIndex).where("urlSlug", "==", fullSlug);
            _context11.next = 6;
            return slugTaken.get();

          case 6:
            slugTaken = _context11.sent;
            console.log("slugTaken: ", slugTaken);

            if (!(slugTaken.docs.length > 0)) {
              _context11.next = 12;
              break;
            }

            return _context11.abrupt("return", true);

          case 12:
            return _context11.abrupt("return", false);

          case 13:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _slugTaken2.apply(this, arguments);
}

function _generateRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}

function _generateSlugExtension() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

  var slugExtLen = _generateRandomInt(len);

  var slugExt = "-" + (0, _nanoid.nanoid)(slugExtLen);
  return slugExt;
}

function _generateUniqueSlug(_x22, _x23) {
  return _generateUniqueSlug2.apply(this, arguments);
}

function _generateUniqueSlug2() {
  _generateUniqueSlug2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(slug, searchIndex) {
    var slugExt, newSlug, slugTaken;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            slugExt = _generateSlugExtension();
            newSlug = slug + slugExt;
            _context12.next = 4;
            return _slugTaken(newSlug, searchIndex);

          case 4:
            slugTaken = _context12.sent;

            if (!slugTaken) {
              _context12.next = 9;
              break;
            }

            return _context12.abrupt("return", _generateUniqueSlug(slug, searchIndex));

          case 9:
            return _context12.abrupt("return", newSlug);

          case 10:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _generateUniqueSlug2.apply(this, arguments);
}

function addDocToSearchIndex(_x24, _x25) {
  return _addDocToSearchIndex.apply(this, arguments);
} // ---------------------------
// 	Utils : Deletion Pipeline
// ---------------------------


function _addDocToSearchIndex() {
  _addDocToSearchIndex = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(data, searchIndex) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            console.log("[addDocToSearchIndex]");
            _context13.prev = 1;

            _services.AlgoliaSearch.addDocToIndex(data, searchIndex);

            _context13.next = 8;
            break;

          case 5:
            _context13.prev = 5;
            _context13.t0 = _context13["catch"](1);
            throw new Error(_context13.t0);

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[1, 5]]);
  }));
  return _addDocToSearchIndex.apply(this, arguments);
}

function deletionPipeline(id, searchIndex) {
  removeIdFromSearchIndex(id, searchIndex);
}

function removeIdFromSearchIndex(_x26, _x27) {
  return _removeIdFromSearchIndex.apply(this, arguments);
} // async function removeDocFromSearchIndex(docRef, searchIndex) {
// 	let snapshot = await docRef.get()
// 	try { AlgoliaSearch.removeDocFromIndex(snapshot.data(), searchIndex) }
// 	catch (err) { throw new Error(err) }
// }
// ---------------------------
// 	Utils : User
// ---------------------------


function _removeIdFromSearchIndex() {
  _removeIdFromSearchIndex = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(id, searchIndex) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;

            _services.AlgoliaSearch.removeIdFromIndex(id, searchIndex);

            _context14.next = 7;
            break;

          case 4:
            _context14.prev = 4;
            _context14.t0 = _context14["catch"](0);
            throw new Error(_context14.t0);

          case 7:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 4]]);
  }));
  return _removeIdFromSearchIndex.apply(this, arguments);
}

function buildUserDoc(userRecord) {
  return {
    uid: userRecord.uid,
    displayName: userRecord.displayName || '',
    photoURL: userRecord.photoURL || '',
    visibilty: 'public'
  };
}

function getUserRecord(_x28) {
  return _getUserRecord.apply(this, arguments);
}

function _getUserRecord() {
  _getUserRecord = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(id) {
    var docRef, snapshot;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            docRef = app.firestore().collection('users').doc(id);
            _context15.next = 3;
            return docRef.get();

          case 3:
            snapshot = _context15.sent;
            console.log("[getUserRecord]");
            console.log("user: ", snapshot.data());
            return _context15.abrupt("return", snapshot.data());

          case 7:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));
  return _getUserRecord.apply(this, arguments);
}
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
            console.log("context.params.userId: ", context.params.userId);
            deletionPipeline(context.params.userId, 'users');

          case 3:
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

exports.onProjectDelete = onProjectDelete;

function intakePipeline(_x13, _x14) {
  return _intakePipeline.apply(this, arguments);
}

function _intakePipeline() {
  _intakePipeline = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(snapshot, searchIndex) {
    var docRef;
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
            // TODO Check: doc uid != item uid, item uid = doc uid
            docRef = snapshot.ref; // <DocumentReference>

            _context7.next = 7;
            return addTimestampToDoc(docRef, searchIndex);

          case 7:
            if (!(searchIndex !== 'users')) {
              _context7.next = 10;
              break;
            }

            _context7.next = 10;
            return addCreatorToDoc(docRef);

          case 10:
            _context7.next = 12;
            return addUrlPathToDoc(docRef, searchIndex);

          case 12:
            addDocToSearchIndex(docRef, searchIndex);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _intakePipeline.apply(this, arguments);
}

function addTimestampToDoc(_x15, _x16) {
  return _addTimestampToDoc.apply(this, arguments);
}

function _addTimestampToDoc() {
  _addTimestampToDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(docRef, collection) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            return _context8.abrupt("return", docRef.set({
              createdAt: Date.now()
            }, {
              merge: true
            }));

          case 4:
            _context8.prev = 4;
            _context8.t0 = _context8["catch"](0);
            throw new Error(_context8.t0);

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 4]]);
  }));
  return _addTimestampToDoc.apply(this, arguments);
}

function addCreatorToDoc(_x17) {
  return _addCreatorToDoc.apply(this, arguments);
}

function _addCreatorToDoc() {
  _addCreatorToDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(docRef) {
    var snapshot, data, creator;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log('[addCreatorToSnapshot]');
            _context9.next = 3;
            return docRef.get();

          case 3:
            snapshot = _context9.sent;
            data = snapshot.data();
            creator = null; // TODO *** Need to get the 'doc.creator.uid' pattern implemented in client and Security Rules ***

            _context9.prev = 6;
            _context9.next = 9;
            return getUserRecord(data.creator.uid);

          case 9:
            creator = _context9.sent;
            _context9.next = 15;
            break;

          case 12:
            _context9.prev = 12;
            _context9.t0 = _context9["catch"](6);
            throw new Error(_context9.t0);

          case 15:
            console.log('creator: ', creator); // TODO need to set values for anonymous users

            _context9.prev = 16;
            _context9.next = 19;
            return docRef.set({
              creator: {
                displayName: creator.displayName || '',
                photoURL: creator.photoURL || ''
              }
            }, {
              mergeFields: ['creator.displayName', 'creator.photoURL']
            });

          case 19:
            _context9.next = 24;
            break;

          case 21:
            _context9.prev = 21;
            _context9.t1 = _context9["catch"](16);
            throw new Error(_context9.t1);

          case 24:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[6, 12], [16, 21]]);
  }));
  return _addCreatorToDoc.apply(this, arguments);
}

function addUrlPathToDoc(_x18, _x19) {
  return _addUrlPathToDoc.apply(this, arguments);
}

function _addUrlPathToDoc() {
  _addUrlPathToDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(docRef, searchIndex) {
    var snapshot, data, path, pathTaken;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return docRef.get();

          case 2:
            snapshot = _context10.sent;
            data = snapshot.data();
            path = null;

            if (searchIndex === 'users') {
              path = data.displayName;
            } else {
              path = data.name;
            }

            path.toLowerCase();
            path = path.replace(' ', '_');
            path = encodeURIComponent(path);
            _context10.next = 11;
            return _pathTaken(path, searchIndex);

          case 11:
            pathTaken = _context10.sent;

            if (!pathTaken) {
              _context10.next = 16;
              break;
            }

            _context10.next = 15;
            return _generateUniquePath(path, searchIndex);

          case 15:
            path = _context10.sent;

          case 16:
            docRef.set({
              urlPath: path
            }, {
              merge: true
            });

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _addUrlPathToDoc.apply(this, arguments);
}

function _pathTaken(_x20, _x21) {
  return _pathTaken2.apply(this, arguments);
}

function _pathTaken2() {
  _pathTaken2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(path, searchIndex) {
    var pathTaken;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return app.firestore().collection(searchIndex).where("urlPath", "==", path);

          case 2:
            pathTaken = _context11.sent;
            _context11.next = 5;
            return pathTaken.get();

          case 5:
            pathTaken = _context11.sent;

            if (!(pathTaken.docs.length > 0)) {
              _context11.next = 10;
              break;
            }

            return _context11.abrupt("return", true);

          case 10:
            return _context11.abrupt("return", false);

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _pathTaken2.apply(this, arguments);
}

function _generateRandomInt(max) {
  var val = Math.floor(Math.random() * Math.floor(max));

  if (val === 0) {
    return _generateRandomInt(max);
  } else {
    return val;
  }
}

function _generatePathExtension() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

  var pathExtLen = _generateRandomInt(len);

  var pathExt = "-" + (0, _nanoid.nanoid)(pathExtLen);
  return pathExt;
}

function _generateUniquePath(_x22, _x23) {
  return _generateUniquePath2.apply(this, arguments);
}

function _generateUniquePath2() {
  _generateUniquePath2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(path, searchIndex) {
    var pathExt, tmpPath, pathTaken;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            pathExt = _generatePathExtension();
            tmpPath = path + pathExt;
            _context12.next = 4;
            return _pathTaken(tmpPath, searchIndex);

          case 4:
            pathTaken = _context12.sent;

            if (!pathTaken) {
              _context12.next = 9;
              break;
            }

            return _context12.abrupt("return", _generateUniquePath(path, searchIndex));

          case 9:
            return _context12.abrupt("return", tmpPath);

          case 10:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _generateUniquePath2.apply(this, arguments);
}

function addDocToSearchIndex(_x24, _x25) {
  return _addDocToSearchIndex.apply(this, arguments);
} // ---------------------------
// 	Utils : Deletion Pipeline
// ---------------------------


function _addDocToSearchIndex() {
  _addDocToSearchIndex = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(docRef, searchIndex) {
    var snapshot;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            console.log("[addDocToSearchIndex]");
            _context13.next = 3;
            return docRef.get();

          case 3:
            snapshot = _context13.sent;
            console.log("doc: ", snapshot.data());
            _context13.prev = 5;

            _services.AlgoliaSearch.addDocToIndex(snapshot.data(), searchIndex);

            _context13.next = 12;
            break;

          case 9:
            _context13.prev = 9;
            _context13.t0 = _context13["catch"](5);
            throw new Error(_context13.t0);

          case 12:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[5, 9]]);
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
            _context15.next = 2;
            return app.firestore().collection('users').doc(id);

          case 2:
            docRef = _context15.sent;
            _context15.next = 5;
            return docRef.get();

          case 5:
            snapshot = _context15.sent;
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
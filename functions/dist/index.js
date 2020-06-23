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
// TODO Check(?): doc.uid != item.uid ? item.uid = doc.uid

exports.onProjectDelete = onProjectDelete;

function intakePipeline(_x13, _x14) {
  return _intakePipeline.apply(this, arguments);
}

function _intakePipeline() {
  _intakePipeline = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(snapshot, searchIndex) {
    var docRef, data, promises;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!(0, _lodash.isNil)(snapshot)) {
              _context8.next = 2;
              break;
            }

            throw new Error('`intakePipeline()` parameter `snapshot` cannot be null');

          case 2:
            if (!(0, _lodash.isNil)(searchIndex)) {
              _context8.next = 4;
              break;
            }

            throw new Error('`intakePipeline()` parameter `searchIndex` cannot be null');

          case 4:
            docRef = snapshot.ref;
            data = snapshot.data();
            promises = [];
            addTimestamp(data);

            if (searchIndex !== 'users') {
              promises.push(addCreator(data));
            }

            promises.push(addSlug(data, searchIndex));
            return _context8.abrupt("return", Promise.all(promises).then( /*#__PURE__*/function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(val) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.prev = 0;
                        _context7.next = 3;
                        return docRef.set(data);

                      case 3:
                        if (!(0, _lodash.isNil)(data.creator)) {
                          if (!(0, _lodash.isNil)(data.creator.docRef)) {
                            delete data.creator.docRef;
                          } // NB. was causing a circular reference error with algolia

                        }

                        _context7.next = 6;
                        return addDocToSearchIndex(data, searchIndex);

                      case 6:
                        _context7.next = 19;
                        break;

                      case 8:
                        _context7.prev = 8;
                        _context7.t0 = _context7["catch"](0);
                        _context7.prev = 10;
                        _context7.next = 13;
                        return app.firestore().collection(searchIndex).doc(data.uid)["delete"]();

                      case 13:
                        _context7.next = 18;
                        break;

                      case 15:
                        _context7.prev = 15;
                        _context7.t1 = _context7["catch"](10);
                        throw new Error(_context7.t1);

                      case 18:
                        throw new Error(_context7.t0);

                      case 19:
                        return _context7.abrupt("return");

                      case 20:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, null, [[0, 8], [10, 15]]);
              }));

              return function (_x28) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _intakePipeline.apply(this, arguments);
}

function addTimestamp(_x15) {
  return _addTimestamp.apply(this, arguments);
} // async function addTimestampToDoc(docRef, collection) {
// 	try { return docRef.set({ createdAt: Date.now() }, { merge: true }) }
// 	catch (err) { throw new Error(err) }
// }


function _addTimestamp() {
  _addTimestamp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(data) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            data.createdAt = Date.now();

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _addTimestamp.apply(this, arguments);
}

function addCreator(_x16) {
  return _addCreator.apply(this, arguments);
} // return new Promise((resolve, reject) => {
// 	try {
// 		let creator = await getUserRecord(data.creator.uid)
// 		// TODO data.creator.uid should already be set
// 		data.creator.displayName = creator.displayName
// 		data.creator.photoURL = creator.photoURL
// 		data.creator.docRef = app.firestore().collection('users').doc(data.creator.uid)
// 		resolve(data)
// 	}
// 	catch (err) {
// 		reject(err)
// 	}
// 	// TODO is this the right place for this?
// 	return
// })
// async function addCreatorToDoc(docRef, data) {
// 	console.log('[addCreatorToSnapshot]')
// 	let snapshot = await docRef.get()
// 	let data = snapshot.data()
// 	let creator = null
//
// 	try { creator = await getUserRecord(data.creator.uid) } 
// 	catch (err) { throw new Error(err) }
//
// 	console.log('creator: ', creator)
//
// 	// TODO need to set values for anonymous users
// 	try { await docRef.set(
// 		{
// 			creator: {
// 				displayName: creator.displayName || '',
// 				photoURL: creator.photoURL || '',
// 				docRef: app.firestore().collection('usrs').doc(data.creator.uid),
// 			}
// 		},
// 		{ 
// 			mergeFields: [
// 				'creator.displayName',
// 				'creator.photoURL',
// 				'creator.docRef',
// 			]
// 		}
// 	)}
// 	catch (err) { throw new Error(err) }
// }


function _addCreator() {
  _addCreator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(data) {
    var creator;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            creator = null;
            _context10.prev = 1;
            _context10.next = 4;
            return getUserRecord(data.creator.uid);

          case 4:
            creator = _context10.sent;
            _context10.next = 10;
            break;

          case 7:
            _context10.prev = 7;
            _context10.t0 = _context10["catch"](1);
            throw new Error(_context10.t0);

          case 10:
            // TODO data.creator.uid should already be set
            data.creator.displayName = creator.displayName || '';
            data.creator.photoURL = creator.photoURL || '';
            data.creator.docRef = app.firestore().collection('users').doc(data.creator.uid);
            data.creator.urlSlug = creator.urlSlug || '';

          case 14:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 7]]);
  }));
  return _addCreator.apply(this, arguments);
}

function addSlug(_x17, _x18) {
  return _addSlug.apply(this, arguments);
} // async function addUrlPathToDoc(docRef, searchIndex) {
// 	let snapshot = await docRef.get()
// 	let data = snapshot.data()
// 	let path = null
// 	if (searchIndex === 'users') { path = data.displayName } 
// 	else { path = data.name }
// 	path.toLowerCase()
// 	path = path.replace(' ', '_')
// 	path = encodeURIComponent(path)
// 	let pathTaken = await _pathTaken(path, searchIndex)
// 	if (pathTaken) { path = await _generateUniquePath(path, searchIndex) }
// 	docRef.set({ urlPath: path }, { merge: true } )
// }


function _addSlug() {
  _addSlug = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(data, searchIndex) {
    var slug, slugTaken;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            slug = null;

            if (searchIndex === 'users') {
              slug = data.displayName;
            } else {
              slug = data.name;
            }

            if (slug === '') {
              slug = data.uid;
            }

            slug = slug.toLowerCase();
            slug = slug.replace(' ', '_');
            slug = encodeURIComponent(slug);
            _context11.next = 8;
            return _slugTaken(slug, searchIndex);

          case 8:
            slugTaken = _context11.sent;

            if (!slugTaken) {
              _context11.next = 13;
              break;
            }

            _context11.next = 12;
            return _generateUniqueSlug(slug, searchIndex);

          case 12:
            slug = _context11.sent;

          case 13:
            data.urlSlug = searchIndex + '/' + slug;

          case 14:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _addSlug.apply(this, arguments);
}

function _slugTaken(_x19, _x20) {
  return _slugTaken2.apply(this, arguments);
} // async function _pathTaken(path, searchIndex) {
// 	let pathTaken = await app.firestore().collection(searchIndex).where("urlPath", "==", path)
// 	pathTaken = await pathTaken.get()
// 	if (pathTaken.docs.length > 0) { return true }
// 	else { return false }
// }


function _slugTaken2() {
  _slugTaken2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(slug, searchIndex) {
    var fullSlug, slugTaken;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            fullSlug = searchIndex + '/' + slug;
            slugTaken = app.firestore().collection(searchIndex).where("urlSlug", "==", fullSlug);
            _context12.next = 4;
            return slugTaken.get();

          case 4:
            slugTaken = _context12.sent;

            if (!(slugTaken.docs.length > 0)) {
              _context12.next = 9;
              break;
            }

            return _context12.abrupt("return", true);

          case 9:
            return _context12.abrupt("return", false);

          case 10:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _slugTaken2.apply(this, arguments);
}

function _generateRandomInt(max) {
  var val = Math.floor(Math.random() * Math.floor(max));

  if (val === 0) {
    return _generateRandomInt(max);
  } else {
    return val;
  }
}

function _generateSlugExtension() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

  var slugExtLen = _generateRandomInt(len);

  var slugExt = "-" + (0, _nanoid.nanoid)(slugExtLen);
  return slugExt;
} // function _generatePathExtension(len=6) {
// 	let pathExtLen = _generateRandomInt(len) 
// 	let pathExt = "-" + nanoid(pathExtLen)
// 	return pathExt
// }


function _generateUniqueSlug(_x21, _x22) {
  return _generateUniqueSlug2.apply(this, arguments);
} // async function _generateUniquePath(path, searchIndex) {
// 	let pathExt = _generatePathExtension()
// 	let tmpPath = path + pathExt
// 	let pathTaken = await _pathTaken(tmpPath, searchIndex)
// 	if (pathTaken) { return _generateUniquePath(path, searchIndex) }
// 	else { return tmpPath }
// }


function _generateUniqueSlug2() {
  _generateUniqueSlug2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(slug, searchIndex) {
    var slugExt, newSlug, slugTaken;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            slugExt = _generateSlugExtension();
            newSlug = slug + slugExt;
            _context13.next = 4;
            return _slugTaken(newSlug, searchIndex);

          case 4:
            slugTaken = _context13.sent;

            if (!slugTaken) {
              _context13.next = 9;
              break;
            }

            return _context13.abrupt("return", _generateUniqueSlug(slug, searchIndex));

          case 9:
            return _context13.abrupt("return", newSlug);

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _generateUniqueSlug2.apply(this, arguments);
}

function addDocToSearchIndex(_x23, _x24) {
  return _addDocToSearchIndex.apply(this, arguments);
} // async function addDocToSearchIndex(docRef, searchIndex) {
// 	console.log("[addDocToSearchIndex]")
// 	let snapshot = await docRef.get()
// 	console.log("doc: ", snapshot.data())
// 	try { AlgoliaSearch.addDocToIndex(snapshot.data(), searchIndex) }
// 	catch (err) { throw new Error(err) }
// }
// ---------------------------
// 	Utils : Deletion Pipeline
// ---------------------------


function _addDocToSearchIndex() {
  _addDocToSearchIndex = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(data, searchIndex) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            console.log("[addDocToSearchIndex]");
            _context14.prev = 1;

            _services.AlgoliaSearch.addDocToIndex(data, searchIndex);

            _context14.next = 8;
            break;

          case 5:
            _context14.prev = 5;
            _context14.t0 = _context14["catch"](1);
            throw new Error(_context14.t0);

          case 8:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[1, 5]]);
  }));
  return _addDocToSearchIndex.apply(this, arguments);
}

function deletionPipeline(id, searchIndex) {
  removeIdFromSearchIndex(id, searchIndex);
}

function removeIdFromSearchIndex(_x25, _x26) {
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
  _removeIdFromSearchIndex = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(id, searchIndex) {
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;

            _services.AlgoliaSearch.removeIdFromIndex(id, searchIndex);

            _context15.next = 7;
            break;

          case 4:
            _context15.prev = 4;
            _context15.t0 = _context15["catch"](0);
            throw new Error(_context15.t0);

          case 7:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 4]]);
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

function getUserRecord(_x27) {
  return _getUserRecord.apply(this, arguments);
}

function _getUserRecord() {
  _getUserRecord = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(id) {
    var docRef, snapshot;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            docRef = app.firestore().collection('users').doc(id);
            _context16.next = 3;
            return docRef.get();

          case 3:
            snapshot = _context16.sent;
            return _context16.abrupt("return", snapshot.data());

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
  return _getUserRecord.apply(this, arguments);
}
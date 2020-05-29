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

// import 'babel-polyfill'
// import * as admin from 'firebase-admin'
var client = (0, _algoliasearch["default"])(functions.config().algolia.app_id, functions.config().algolia.admin_key, {
  requester: (0, _requesterNodeHttp.createNodeHttpRequester)()
});
var usersIndex = client.initIndex('users');
usersIndex.setSettings({
  searchableAttributes: ['displayName', 'uid']
});
var projectsIndex = client.initIndex('projects');
projectsIndex.setSettings({
  searchableAttributes: ['name', 'description']
});
var SearchIndex = {
  users: usersIndex,
  projects: projectsIndex
};
var _default = SearchIndex; // index
// .saveObjects(objects)
// .then(({ objectIDs }) => {
// 	console.log(objectIDs);
// })
// .catch(err => {
// 	console.log(err);
// });

exports["default"] = _default;
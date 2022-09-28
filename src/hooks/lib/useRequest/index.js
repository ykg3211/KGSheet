"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Mode", {
  enumerable: true,
  get: function get() {
    return _mode.Mode;
  }
});
exports.default = exports.UseRequestProvider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _useBaseRequest = _interopRequireDefault(require("./useBaseRequest"));

var _useLoadMore = _interopRequireDefault(require("./useLoadMore"));

var _usePagination = _interopRequireDefault(require("./usePagination"));

var _useSearch = _interopRequireDefault(require("./useSearch"));

var _mode = require("./mode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ConfigContext = /*#__PURE__*/_react.default.createContext({});

ConfigContext.displayName = 'UseRequestConfigContext';

function useRequest(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var contextConfig = (0, _react.useContext)(ConfigContext);

  var finalOptions = _objectSpread(_objectSpread({}, contextConfig), options);

  var mode = finalOptions.mode;

  if (mode === _mode.Mode.loadMore) {
    return (0, _useLoadMore.default)(requestFn, finalOptions);
  }

  if (mode === _mode.Mode.pagination) {
    return (0, _usePagination.default)(requestFn, finalOptions);
  }

  if (mode === _mode.Mode.search) {
    return (0, _useSearch.default)(requestFn, finalOptions);
  }

  return (0, _useBaseRequest.default)(requestFn, finalOptions);
}

var UseRequestProvider = ConfigContext.Provider;
exports.UseRequestProvider = UseRequestProvider;
var _default = useRequest;
exports.default = _default;
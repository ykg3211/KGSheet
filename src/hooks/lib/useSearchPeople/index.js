"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSearchPeople;

var _react = require("react");

var _useDebounceFn = _interopRequireDefault(require("../useDebounceFn"));

var _useCloudJwt3 = _interopRequireDefault(require("../useCloudJwt"));

var _useBaseRequest = _interopRequireDefault(require("../useRequest/useBaseRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ACCESS_URL = 'https://ms.byted.org/platform/auth/user/info/suggest/by_user_prefix';

function useSearchPeople() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    suffix: true
  };
  var suffix = options.suffix,
      jwtToken = options.jwtToken,
      _options$useJwtToken = options.useJwtToken,
      useJwtToken = _options$useJwtToken === void 0 ? false : _options$useJwtToken,
      wait = options.wait,
      size = options.size;

  var _useCloudJwt = (0, _useCloudJwt3.default)(jwtToken, useJwtToken),
      _useCloudJwt2 = _slicedToArray(_useCloudJwt, 1),
      token = _useCloudJwt2[0];

  var fetchOptions = (0, _react.useCallback)(_async(function (_ref) {
    var _ref$keyword = _ref.keyword,
        keyword = _ref$keyword === void 0 ? '' : _ref$keyword,
        _ref$curPage = _ref.curPage,
        curPage = _ref$curPage === void 0 ? 1 : _ref$curPage,
        _ref$size = _ref.size,
        size = _ref$size === void 0 ? 30 : _ref$size,
        _ref$jwtToken = _ref.jwtToken,
        jwtToken = _ref$jwtToken === void 0 ? '' : _ref$jwtToken;

    var __times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var options = {
      headers: {
        'X-Jwt-Token': token || ''
      },
      method: 'GET'
    };
    var url = "".concat(ACCESS_URL, "?user_prefix=").concat(keyword, "&pn=").concat(curPage, "&rn=").concat(size);
    return _await(fetch(url, options), function (res) {
      return __times < 10 && res.status === 401 ? fetchOptions({
        keyword: keyword,
        curPage: curPage,
        size: size
      }, __times + 1) : res.json();
    });
  }), [token]);

  var _useRequest = (0, _useBaseRequest.default)(function (v) {
    return fetchOptions(_objectSpread({
      keyword: v,
      curPage: 1
    }, options)).then(function (res) {
      if (res.data && res.data.length) {
        if (suffix) {
          return res.data;
        }

        return res.data.map(function (option) {
          return _objectSpread(_objectSpread({}, option), {}, {
            email: option.email.split('@')[0]
          });
        });
      }

      return [];
    });
  }, {
    auto: false,
    refreshDeps: [suffix, jwtToken, wait, size]
  }),
      getData = _useRequest.run,
      _useRequest$data = _useRequest.data,
      data = _useRequest$data === void 0 ? [] : _useRequest$data,
      loading = _useRequest.loading,
      error = _useRequest.error;

  var search = (0, _useDebounceFn.default)(_async(function (v) {
    if (v === '') return;
    getData(v);
    return _await();
  }), wait || 500).run;
  return {
    search: search,
    data: data,
    // setData,
    loading: loading,
    error: error,
    fetchData: fetchOptions
  };
}
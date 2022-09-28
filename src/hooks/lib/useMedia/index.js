"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.mockMediaQueryList = void 0;

var _react = require("react");

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var mockMediaQueryList = {
  media: '',
  matches: false,
  onchange: function onchange() {},
  addListener: function addListener() {},
  removeListener: function removeListener() {},
  addEventListener: function addEventListener() {},
  removeEventListener: function removeEventListener() {},
  // @ts-ignore
  dispatchEvent: function dispatchEvent() {
    return true;
  }
};
exports.mockMediaQueryList = mockMediaQueryList;

var useMedia = function useMedia(rawQuery) {
  var defaultState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _useState = (0, _react.useState)(defaultState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var query = (0, _utils.queryObjectToString)(rawQuery);
  (0, _react.useEffect)(function () {
    var mounted = true;
    var mediaQueryList = typeof window === 'undefined' ? mockMediaQueryList : window.matchMedia(query);

    var onChange = function onChange() {
      if (!mounted) {
        return;
      }

      setState(Boolean(mediaQueryList.matches));
    };

    mediaQueryList.addListener(onChange);
    setState(mediaQueryList.matches);
    return function () {
      mounted = false;
      mediaQueryList.removeListener(onChange);
    };
  }, [query]);
  return state;
};

var _default = useMedia;
exports.default = _default;
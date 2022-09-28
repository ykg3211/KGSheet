"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useNumber() {
  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var min = options.min,
      max = options.max;
  var format = (0, _react.useCallback)(function (value) {
    if (typeof max === 'number') {
      value = Math.min(max, value);
    }

    if (typeof min === 'number') {
      value = Math.max(min, value);
    }

    return value;
  }, [min, max]);
  var init = (0, _react.useMemo)(function () {
    return format(initialValue);
  }, [initialValue, format]);

  var _useState = (0, _react.useState)(init),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var stateMethods = (0, _react.useMemo)(function () {
    var setValue = function setValue(value) {
      setState(function (c) {
        var target = typeof value === 'number' ? value : value(c);
        return format(target);
      });
    };

    var inc = function inc() {
      var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      setValue(function (c) {
        return c + delta;
      });
    };

    var dec = function dec() {
      var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      setValue(function (c) {
        return c - delta;
      });
    };

    var set = function set(value) {
      setValue(value);
    };

    var reset = function reset() {
      setValue(init);
    };

    return {
      inc: inc,
      dec: dec,
      set: set,
      reset: reset
    };
  }, [format, init]);
  return _objectSpread({
    state: state
  }, stateMethods);
}

var _default = useNumber;
exports.default = _default;
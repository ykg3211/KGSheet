"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

var _useThrottleFn2 = _interopRequireDefault(require("../useThrottleFn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var DEFAULT_THROTTLE = 50;

var useSize = function useSize(el) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  // FIXME 兼容旧参数，2.0 移除
  var dimension;
  var throttle = DEFAULT_THROTTLE;

  if (typeof options === 'string') {
    dimension = options;
  } else {
    if (options.dimension) {
      dimension = options.dimension;
    }

    if (options.throttle) {
      throttle = options.throttle;
    }
  }

  var ref = (0, _react.useRef)();

  var _useState = (0, _react.useState)(function () {
    var node = typeof el === 'function' ? el() : el;
    return {
      width: (node || {}).clientWidth || 0,
      height: (node || {}).clientHeight || 0
    };
  }),
      _useState2 = _slicedToArray(_useState, 2),
      size = _useState2[0],
      setSize = _useState2[1];

  var observeCallback = (0, _react.useCallback)(function (entries) {
    if (!(entries !== null && entries !== void 0 && entries.length)) return;
    var _entries$0$contentRec = entries[0].contentRect,
        width = _entries$0$contentRec.width,
        height = _entries$0$contentRec.height;
    setSize(function (s) {
      if (s) {
        if (dimension === 'width') {
          return s.width !== width ? {
            width: width,
            height: height
          } : s;
        }

        if (dimension === 'height') {
          return s.height !== height ? {
            width: width,
            height: height
          } : s;
        }

        return s.width !== width || s.height !== height ? {
          width: width,
          height: height
        } : s;
      }

      return {
        width: width,
        height: height
      };
    });
  }, [dimension]);

  var _useThrottleFn = (0, _useThrottleFn2.default)(observeCallback, throttle, [observeCallback]),
      observeCallbackThrottle = _useThrottleFn.run;

  (0, _react.useLayoutEffect)(function () {
    var target = ref.current;

    if (el) {
      target = typeof el === 'function' ? el() : el;
    }

    var ros = new _resizeObserverPolyfill.default(observeCallbackThrottle);

    if (target) {
      ros.observe(target);
    }

    return function () {
      return ros.disconnect();
    };
  }, [ref.current, typeof el === 'function' ? undefined : el, observeCallback].concat(_toConsumableArray(deps)));
  return [ref, size];
};

var _default = useSize;
exports.default = _default;
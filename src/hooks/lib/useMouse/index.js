"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

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

var useMouse = function useMouse(el, options) {
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var ref = (0, _react.useRef)();

  var _useState = (0, _react.useState)({
    x: -1,
    y: -1
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var handleMouseMove = (0, _react.useCallback)(function (event) {
    var target = ref.current;

    if (!target || !event) {
      return;
    } // 如果传入的是 window 对象, 则返回指针相对于视口的位置


    if (target === window) {
      setState({
        x: Math.round(event.clientX),
        y: Math.round(event.clientY)
      });
      return;
    } // @ts-ignore


    var _target$getBoundingCl = target.getBoundingClientRect(),
        offsetLeft = _target$getBoundingCl.left,
        offsetTop = _target$getBoundingCl.top;

    var pointX = event.clientX;
    var pointY = event.clientY; // 范围检测

    var isInRange = function isInRange(target) {
      var horizontal = pointX >= offsetLeft && pointX <= target.offsetWidth + offsetLeft;
      var longitudinal = pointY >= offsetTop && pointY <= target.offsetHeight + offsetTop;
      return horizontal && longitudinal;
    }; // 如果指针在元素上则返回指针相对位置, 否则返回-1


    if (!isInRange(ref.current)) {
      setState({
        x: -1,
        y: -1
      });
    } else {
      setState({
        x: pointX - offsetLeft,
        y: pointY - offsetTop
      });
    }
  }, [ref.current, typeof el === 'function' ? undefined : el].concat(_toConsumableArray(deps)));

  var _useThrottleFn = (0, _useThrottleFn2.default)(handleMouseMove, (options === null || options === void 0 ? void 0 : options.throttle) || 50, [handleMouseMove]),
      handleMouseMoveThrottle = _useThrottleFn.run;

  (0, _react.useLayoutEffect)(function () {
    if (el) {
      ref.current = typeof el === 'function' ? el() : el;
    } else if (!ref.current) {
      ref.current = window;
    }

    if (ref.current) {
      window.addEventListener('mousemove', handleMouseMoveThrottle, false);
    }

    return function () {
      window.removeEventListener('mousemove', handleMouseMoveThrottle, false);
    };
  }, [handleMouseMove]);
  return [ref, state];
};

var _default = useMouse;
exports.default = _default;
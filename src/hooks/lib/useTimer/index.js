"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTimer;

var _react = require("react");

var _useUpdateEffect = _interopRequireDefault(require("../useUpdateEffect"));

var _time = require("./utils/time");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function useTimer(time) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPaused = _useState2[0],
      setIsPaused = _useState2[1];

  var _options$auto = options.auto,
      auto = _options$auto === void 0 ? true : _options$auto,
      _options$onComplete = options.onComplete,
      onComplete = _options$onComplete === void 0 ? function () {} : _options$onComplete;

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isCounting = _useState4[0],
      setisCounting = _useState4[1];

  var isCountDown = options.isCountDown || typeof time === 'number';
  var timeRef = (0, _react.useRef)(isCountDown ? typeof time === 'number' ? Date.now() + time : Number(time) : Number(time));
  var timeHandle = (0, _react.useRef)();

  var _useState5 = (0, _react.useState)(function () {
    return (0, _time.formatTime)(timeRef.current, true);
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      timeProperties = _useState6[0],
      setTimeProperties = _useState6[1];

  (0, _react.useEffect)(function () {
    if (!isCountDown || auto && isCountDown) {
      setisCounting(true);
      timeHandle.current = window.requestAnimationFrame(function () {
        return showTime();
      });
    }

    return clearRef;
  }, []);
  (0, _useUpdateEffect.default)(function () {
    timeRef.current = isCountDown ? typeof time === 'number' ? Date.now() + time : Number(time) : Number(time);
    setTimeProperties(function () {
      return (0, _time.formatTime)(timeRef.current, true);
    });

    if (auto) {
      setisCounting(true);
      timeHandle.current = window.requestAnimationFrame(function () {
        return showTime();
      });
    }
  }, [].concat(_toConsumableArray(deps), [isCountDown && time]));

  var clearRef = function clearRef() {
    timeHandle.current = 0;
    setisCounting(false);
    window.cancelAnimationFrame(timeHandle.current || 0);
  };

  var showTime = function showTime() {
    var formatedTime = (0, _time.formatTime)(timeRef.current, !isCountDown);
    setTimeProperties(formatedTime);

    if (formatedTime.remainingTime >= 16 && timeHandle.current) {
      // showTime(endTime)
      timeHandle.current = window.requestAnimationFrame(function () {
        return showTime();
      });
    } else {
      if (timeHandle.current) {
        onComplete();
        clearRef();
      }
    }
  };

  var timeMethods = (0, _react.useMemo)(function () {
    var start = function start() {
      setisCounting(true);
      setIsPaused(false); // 在开始前点击 timeRef.current > 0 并且 timeProperties.remainingTime  === number * 1000
      // 在暂停后点击 timeProperties.remainingTime > 16 并且 timeHandle.current === 0

      if (timeProperties.remainingTime >= 16 && !timeHandle.current || timeRef.current && timeProperties.remainingTime === Number(time)) {
        timeRef.current = Date.now() + timeProperties.remainingTime;
        timeHandle.current = window.requestAnimationFrame(function () {
          return showTime();
        });
      }
    };

    var pause = function pause() {
      clearRef();
      setisCounting(false);
      setIsPaused(true);
    };

    var reset = function reset() {
      var withBegin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var resetTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : time;
      clearRef();
      var timeProperties = (0, _time.formatTime)(Date.now() + Number(resetTime));
      setIsPaused(!withBegin);
      setisCounting(withBegin);
      setTimeProperties(timeProperties);

      if (withBegin) {
        timeRef.current = Date.now() + timeProperties.remainingTime;
        timeHandle.current = window.requestAnimationFrame(function () {
          return showTime();
        });
      }
    };

    return {
      start: start,
      pause: pause,
      reset: reset
    };
  }, [timeProperties, isCounting, isPaused]);

  if (isCountDown) {
    // @ts-ignore
    return _objectSpread(_objectSpread(_objectSpread({}, timeProperties), timeMethods), {}, {
      isCounting: isCounting,
      isPaused: isPaused,
      isPausing: isPaused
    });
  } // @ts-ignore


  return _objectSpread({}, timeProperties);
}
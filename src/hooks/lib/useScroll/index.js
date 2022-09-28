"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _utils = require("./utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useScroll = function useScroll(el) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _useState = (0, _react.useState)(_utils.INITIAL_DATA),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var ref = (0, _react.useRef)();
  var raf = (0, _react.useRef)(null);
  var timer = (0, _react.useRef)();
  var beginData = (0, _react.useRef)(_utils.INITIAL_DATA);
  var currentData = (0, _react.useRef)(_utils.INITIAL_DATA);
  var beginTimestamp = (0, _react.useRef)();
  var currentTimestamp = (0, _react.useRef)();

  var getScrollData = function getScrollData(data) {
    return _objectSpread(_objectSpread({}, data), {}, {
      time: Math.round(data.time),
      speed: {
        x: Math.round(data.speed.x),
        y: Math.round(data.speed.y)
      },
      totalDistance: {
        x: Math.round(data.totalDistance.x),
        y: Math.round(data.totalDistance.y)
      },
      relativeDistance: {
        x: Math.round(data.relativeDistance.x),
        y: Math.round(data.relativeDistance.y)
      },
      offset: {
        x: Math.round(data.offset.x),
        y: Math.round(data.offset.y)
      }
    });
  };

  var frameHandler = function frameHandler(timestamp) {
    var el = ref.current;
    if (!el) return;
    if (!beginTimestamp.current) beginTimestamp.current = timestamp;
    var time = timestamp - beginTimestamp.current;
    var offset = {
      x: el.scrollLeft,
      y: el.scrollTop
    }; // @ts-ignore

    if (el === window) {
      offset.x = document.documentElement.scrollLeft || document.body.scrollLeft;
      offset.y = document.documentElement.scrollTop || document.body.scrollTop;
    }

    var direction = {
      x: (0, _utils.getDirectionX)(offset.x, currentData.current),
      y: (0, _utils.getDirectionY)(offset.y, currentData.current)
    };
    var totalDistance = {
      x: (0, _utils.getTotalDistanceX)(offset.x, currentData.current),
      y: (0, _utils.getTotalDistanceY)(offset.y, currentData.current)
    };
    var relativeDistance = {
      x: (0, _utils.getRelativeDistanceX)(offset.x, beginData.current),
      y: (0, _utils.getRelativeDistanceY)(offset.y, beginData.current)
    };
    var timestampDiff = timestamp - (currentTimestamp.current || 0);
    var speed = {
      x: (0, _utils.getSpeedX)(offset.x, currentData.current, timestampDiff),
      y: (0, _utils.getSpeedY)(offset.y, currentData.current, timestampDiff)
    };

    var nextcurrentData = _objectSpread(_objectSpread({}, currentData.current), {}, {
      scrolling: true,
      time: time,
      direction: direction,
      speed: speed,
      totalDistance: totalDistance,
      relativeDistance: relativeDistance,
      offset: offset
    });

    currentData.current = nextcurrentData;
    setData(currentData.current);
    currentTimestamp.current = timestamp;
    window.cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(frameHandler);
  };

  var onScrollStart = function onScrollStart() {
    beginData.current = _objectSpread({}, currentData.current);
    window.cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(frameHandler);

    if (typeof options.onScrollStart === 'function') {
      options.onScrollStart(getScrollData(currentData.current));
    }
  };

  var onScrollEnd = function onScrollEnd() {
    currentData.current = _objectSpread(_objectSpread(_objectSpread({}, currentData.current), _utils.INITIAL_DATA), {}, {
      offset: currentData.current.offset,
      relativeDistance: currentData.current.relativeDistance,
      totalDistance: currentData.current.totalDistance
    });
    setData(currentData.current);
    window.cancelAnimationFrame(raf.current);
    beginTimestamp.current = null;
    currentTimestamp.current = null;

    if (typeof options.onScrollEnd === 'function') {
      options.onScrollEnd(getScrollData(currentData.current));
    }
  };

  var clearAndSetTimer = function clearAndSetTimer() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(onScrollEnd, _utils.DEFAULT_TIMEOUT);
  };

  var onScroll = function onScroll() {
    if (!currentData.current.scrolling) {
      onScrollStart();
    }

    if (typeof options.onScroll === 'function') {
      options.onScroll(getScrollData(currentData.current));
    }

    clearAndSetTimer();
  };

  (0, _react.useLayoutEffect)(function () {
    var el1;
    if (options.ref) return;

    if (el) {
      el1 = typeof el === 'function' ? el() : el;

      if (el1 === window) {
        ref.current = window;
      } else {
        ref.current = el1;
      }
    } else {
      el1 = ref.current;
    } // 全局滚动


    if (el1 === window) {
      window.addEventListener('scroll', onScroll, true);
      return function () {
        window.clearTimeout(timer.current);

        if (el1) {
          window.removeEventListener('scroll', onScroll, true);
        }
      };
    }

    if (el1) {
      el1.addEventListener('scroll', onScroll, true);
      return function () {
        window.clearTimeout(timer.current);

        if (el1) {
          el1.removeEventListener('scroll', onScroll, true);
        }
      };
    }
  }, [ref.current, typeof el === 'function' ? undefined : el].concat(_toConsumableArray(deps)));
  (0, _react.useEffect)(function () {
    if (options.ref) {
      var _el = options.ref.current;

      if (_el) {
        ref.current = _el;

        _el.addEventListener('scroll', onScroll, true);

        return function () {
          window.clearTimeout(timer.current);

          if (_el) {
            _el.removeEventListener('scroll', onScroll, true);
          }
        };
      }
    }
  }, [options.ref].concat(_toConsumableArray(deps)));
  return [ref, getScrollData(data)];
};

var _default = useScroll;
exports.default = _default;
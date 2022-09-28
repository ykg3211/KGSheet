"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _screenfull = _interopRequireDefault(require("screenfull"));

var _useBoolean2 = _interopRequireDefault(require("../useBoolean"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-empty: 0 */
var _default = function _default(el, options) {
  var _ref = options || {},
      onExitFull = _ref.onExitFull,
      onFull = _ref.onFull,
      defaultValue = _ref.defaultValue;

  var onExitFullRef = (0, _react.useRef)(onExitFull);
  onExitFullRef.current = onExitFull;
  var onFullRef = (0, _react.useRef)(onFull);
  onFullRef.current = onFull;
  var element = (0, _react.useRef)();

  var _useBoolean = (0, _useBoolean2.default)(defaultValue),
      state = _useBoolean.state,
      toggle = _useBoolean.toggle,
      setTrue = _useBoolean.setTrue,
      setFalse = _useBoolean.setFalse;

  (0, _react.useLayoutEffect)(function () {
    /* 非全屏时，不需要监听任何全屏事件 */
    if (!state) {
      return;
    }

    var passedInElement = typeof el === 'function' ? el() : el;
    var targetElement = passedInElement || element.current;

    if (!targetElement) {
      return;
    }
    /* 监听退出 */


    var onChange = function onChange() {
      if (_screenfull.default.isEnabled) {
        var isFullscreen = _screenfull.default.isFullscreen;
        toggle(isFullscreen);
      }
    };

    if (_screenfull.default.isEnabled) {
      try {
        _screenfull.default.request(targetElement);

        setTrue();

        if (onFullRef.current) {
          onFullRef.current();
        }
      } catch (error) {
        setFalse();

        if (onExitFullRef.current) {
          onExitFullRef.current();
        }
      }

      _screenfull.default.on('change', onChange);
    }
    /* state 从 true 变为 false，则关闭全屏 */


    return function () {
      if (_screenfull.default.isEnabled) {
        try {
          _screenfull.default.off('change', onChange);

          _screenfull.default.exit();
        } catch (error) {}
      }

      if (onExitFullRef.current) {
        onExitFullRef.current();
      }
    };
  }, [state, typeof el === 'function' ? undefined : el]);

  var toggleFull = function toggleFull() {
    return toggle();
  };

  var result = {
    isFullscreen: !!state,
    setFull: setTrue,
    exitFull: setFalse,
    toggleFull: toggleFull
  };

  if (!el) {
    result.ref = element;
  }

  return result;
};

exports.default = _default;
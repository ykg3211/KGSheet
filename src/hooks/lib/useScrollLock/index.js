"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _useBoolean2 = _interopRequireDefault(require("../useBoolean"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preventDefault = function preventDefault(e) {
  e.preventDefault();
};

var useScrollLock = function useScrollLock() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var el = options.el;
  var ref = (0, _react.useRef)();
  var previousOverflowRef = (0, _react.useRef)('');

  var _useBoolean = (0, _useBoolean2.default)(options === null || options === void 0 ? void 0 : options.default),
      state = _useBoolean.state,
      toggle = _useBoolean.toggle,
      setTrue = _useBoolean.setTrue,
      setFalse = _useBoolean.setFalse;

  (0, _react.useLayoutEffect)(function () {
    if (!state) {
      return;
    }

    var target = ref.current || document.body;

    if (el) {
      target = typeof el === 'function' ? el() : el;
    }

    var styleProperty = options !== null && options !== void 0 && options.direction ? "overflow".concat(options === null || options === void 0 ? void 0 : options.direction.toUpperCase()) : 'overflow';
    previousOverflowRef.current = target.style[styleProperty];
    target.style[styleProperty] = 'hidden';
    target.addEventListener('touchmove', preventDefault, {
      passive: false
    });
    return function () {
      // Do not reset if other scripts modify style.
      if (target.style[styleProperty] === 'hidden') {
        target.style[styleProperty] = previousOverflowRef.current;
      } // @ts-ignore


      target.removeEventListener('touchmove', preventDefault, {
        passive: false
      });
    };
  }, [state, ref.current, typeof el === 'function' ? undefined : el]);
  return {
    isLock: state,
    lock: setTrue,
    unlock: setFalse,
    toggle: toggle,
    ref: ref
  };
};

var _default = useScrollLock;
exports.default = _default;
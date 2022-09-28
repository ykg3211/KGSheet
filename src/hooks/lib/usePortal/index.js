"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _useForceUpdate = _interopRequireDefault(require("../useForceUpdate"));

var _react = require("react");

var _reactDom = _interopRequireDefault(require("react-dom"));

var _useBoolean2 = _interopRequireDefault(require("../useBoolean"));

var _useScrollLock2 = _interopRequireDefault(require("../useScrollLock"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usePortal = function usePortal() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var el = options.el,
      scrollLock = options.scrollLock,
      escClose = options.escClose,
      defaultState = options.default;
  var ref = (0, _react.useRef)();

  var _useBoolean = (0, _useBoolean2.default)(defaultState),
      state = _useBoolean.state,
      toggle = _useBoolean.toggle,
      setTrue = _useBoolean.setTrue,
      setFalse = _useBoolean.setFalse;

  var forceUpdate = (0, _useForceUpdate.default)();

  var _useScrollLock = (0, _useScrollLock2.default)(),
      lock = _useScrollLock.lock,
      unlock = _useScrollLock.unlock;

  var Portal = (0, _react.useMemo)(function () {
    return function (_ref) {
      var children = _ref.children;

      if (state) {
        var target = ref.current || document.body;

        if (el) {
          target = typeof el === 'function' ? el() : el;
        }

        if (target) {
          return /*#__PURE__*/_reactDom.default.createPortal(children, target);
        }
      }

      return null;
    };
  }, [state, ref.current, typeof el === 'function' ? undefined : el]);
  (0, _react.useLayoutEffect)(function () {
    forceUpdate();
  }, [ref.current, typeof el === 'function' ? undefined : el]);
  (0, _react.useLayoutEffect)(function () {
    state && scrollLock ? lock() : unlock();
  }, [state, scrollLock]);
  (0, _react.useLayoutEffect)(function () {
    if (!state || !escClose) return;

    var handleKeyDown = function handleKeyDown(e) {
      if (e.keyCode === 27) setFalse();
    };

    document.addEventListener('keydown', handleKeyDown);
    return function () {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, escClose]);
  return {
    Portal: Portal,
    isOpen: state,
    open: setTrue,
    close: setFalse,
    toggle: toggle,
    ref: ref
  };
};

var _default = usePortal;
exports.default = _default;
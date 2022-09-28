"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useEventBus;
exports.emitter = void 0;

var _react = require("react");

var _usePersistCallback = _interopRequireDefault(require("../usePersistCallback"));

var _mitt = require("./mitt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = (0, _mitt.mitt)();
exports.emitter = emitter;

function useEventBus(eventName, callback) {
  var on = emitter.on,
      off = emitter.off,
      emit = emitter.emit;
  var subscribed = (0, _react.useRef)(false);
  var cb = (0, _usePersistCallback.default)(function () {
    if (callback) {
      callback.apply(void 0, arguments);
    }
  });
  var trigger = (0, _usePersistCallback.default)(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    emit.apply(void 0, [eventName].concat(args));
  });
  var subscribe = (0, _usePersistCallback.default)(function () {
    if (!subscribed.current) {
      on(eventName, cb);
      subscribed.current = true;
    }
  });
  var unsubscribe = (0, _usePersistCallback.default)(function () {
    off(eventName, cb);
    subscribed.current = false;
  });
  (0, _react.useEffect)(function () {
    subscribe();
    return function () {
      unsubscribe();
    };
  }, []);

  if (callback) {
    return {
      trigger: trigger,
      unsubscribe: unsubscribe,
      subscribe: subscribe
    };
  }

  return {
    trigger: trigger
  };
}
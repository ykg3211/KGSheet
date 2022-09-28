"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function usePersistCallback(fn) {
  var ref = (0, _react.useRef)();
  ref.current = fn;
  return (0, _react.useCallback)( // @ts-ignore
  function () {
    var fn = ref.current;
    return fn && fn.apply(void 0, arguments);
  }, [ref]);
}

var _default = usePersistCallback;
exports.default = _default;
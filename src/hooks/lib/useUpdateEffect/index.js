"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var useUpdateEffect = function useUpdateEffect(effect, deps) {
  var isMounted = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }

    return function () {};
  }, deps);
};

var _default = useUpdateEffect;
exports.default = _default;
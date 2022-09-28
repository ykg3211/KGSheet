"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

/* eslint consistent-return: 0 */
var useUpdateLayoutEffect = function useUpdateLayoutEffect(effect, deps) {
  var isMounted = (0, _react.useRef)(false);
  (0, _react.useLayoutEffect)(function () {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

var _default = useUpdateLayoutEffect;
exports.default = _default;
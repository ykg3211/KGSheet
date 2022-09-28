"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var usePrevious = function usePrevious(state) {
  var ref = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    ref.current = state;
  });
  return ref.current;
};

var _default = usePrevious;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _default = function _default(fn) {
  var fnRef = (0, _react.useRef)(fn);
  fnRef.current = fn;
  (0, _react.useEffect)(function () {
    return function () {
      return fnRef.current();
    };
  }, []);
};

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _default = function _default(fn) {
  (0, _react.useEffect)(function () {
    fn();
  }, []);
};

exports.default = _default;
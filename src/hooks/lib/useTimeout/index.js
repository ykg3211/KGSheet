"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var useTimeout = function useTimeout(fn, delay) {
  var savedFn = (0, _react.useRef)(fn);
  (0, _react.useEffect)(function () {
    savedFn.current = fn;
  }, [fn]);
  (0, _react.useEffect)(function () {
    if (typeof delay !== 'number') return;
    var id = setTimeout(function () {
      return savedFn.current();
    }, delay);
    return function () {
      return clearTimeout(id);
    };
  }, [delay]);
};

var _default = useTimeout;
exports.default = _default;
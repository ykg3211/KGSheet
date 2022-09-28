"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var useAsyncLayoutEffect = function useAsyncLayoutEffect(asyncCallback, deps) {
  (0, _react.useLayoutEffect)(function () {
    var promiseResult = asyncCallback();
    return function () {
      promiseResult.then(function (cleanup) {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, deps);
};

var _default = useAsyncLayoutEffect;
exports.default = _default;
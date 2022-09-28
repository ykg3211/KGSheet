"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDeepEffect = useDeepEffect;
exports.default = void 0;

var _react = require("react");

var _useDeepMemo = _interopRequireDefault(require("../useDeepMemo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useDeepEffect() {
  var callback = arguments[0];
  var isEqual = arguments[1];
  var deps = arguments[2];

  if (arguments.length === 2) {
    deps = isEqual;
    isEqual = undefined;
  }

  var memoizedDeps = (0, _useDeepMemo.default)(deps, isEqual);
  (0, _react.useEffect)(function () {
    callback();
  }, [memoizedDeps]);
}

var _default = useDeepEffect;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useDeepMemo = function useDeepMemo(value) {
  var isEqual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _lodash.default;
  var cacheValue = (0, _react.useRef)(value);
  var isSame = isEqual(cacheValue.current, value);
  (0, _react.useEffect)(function () {
    if (!isSame) {
      cacheValue.current = value;
    }
  });
  return isSame ? cacheValue.current : value;
};

var _default = useDeepMemo;
exports.default = _default;
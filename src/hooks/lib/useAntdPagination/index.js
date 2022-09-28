"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _usePagination = _interopRequireDefault(require("../usePagination"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useAntdPagination(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _usePagination.default)(requestFn, options);
}

var _default = useAntdPagination;
exports.default = _default;
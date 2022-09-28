"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "useThreadPool", {
  enumerable: true,
  get: function get() {
    return _useThreadPool.default;
  }
});
exports.default = void 0;

var _useThread = _interopRequireDefault(require("./useThread"));

var _useThreadPool = _interopRequireDefault(require("./useThreadPool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _useThread.default;
exports.default = _default;
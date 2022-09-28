"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _lodash = _interopRequireDefault(require("lodash.merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var defaultOptions = {
  mutationObserverInit: {
    attributes: true,
    characterData: true,
    subtree: true,
    childList: true
  },
  callback: function callback() {}
};

var useMutation = function useMutation(el) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var _merge = (0, _lodash.default)(defaultOptions, options),
      mutationObserverInit = _merge.mutationObserverInit,
      callback = _merge.callback;

  var ref = (0, _react.useRef)();
  (0, _react.useLayoutEffect)(function () {
    var target = ref.current;

    if (el) {
      target = typeof el === 'function' ? el() : el;
    }

    var mos = new MutationObserver(callback);

    if (target) {
      mos.observe(target, mutationObserverInit);
    }

    return function () {
      return mos.disconnect();
    };
  }, [ref.current, typeof el === 'function' ? undefined : el].concat(_toConsumableArray(deps)));
  return [ref];
};

var _default = useMutation;
exports.default = _default;
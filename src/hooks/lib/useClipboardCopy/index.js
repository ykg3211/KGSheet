"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _clipbordCopy = _interopRequireDefault(require("./clipbordCopy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useClipboardCopy = function useClipboardCopy() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isCopied = _useState2[0],
      setIsCopied = _useState2[1];

  var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      copyText = _useState4[0],
      setCopyText = _useState4[1];

  var ref = (0, _react.useRef)();

  function copyHanlder(text) {
    (0, _clipbordCopy.default)(text).then(function () {
      if (options.onSuccess) {
        options.onSuccess(text);
      }

      setCopyText(text);
    }).catch(function (error) {
      if (options.onError) {
        options.onError(error);
      }
    });
  }

  var isSupported = (0, _react.useMemo)(function () {
    return !!(navigator.clipboard || document.execCommand && document.queryCommandSupported && document.queryCommandSupported('copy'));
  }, []);
  var copy = (0, _react.useCallback)(function (text) {
    if (typeof text !== 'string') {
      var target = ref.current;

      if (!target) {
        return;
      }

      text = target.value || target.innerText;
    }

    copyHanlder(text);
    setIsCopied(true);
  }, []);
  var cut = (0, _react.useCallback)(function () {
    var target = ref.current;

    if (!target) {
      return;
    }

    var text = target.value || target.innerText;
    target.value = '';
    target.innerText = '';
    copyHanlder(text);
    setIsCopied(true);
  }, []);
  var clear = (0, _react.useCallback)(function () {
    copyHanlder('');
    setIsCopied(false);
  }, []);
  return {
    ref: ref,
    isSupported: isSupported,
    isCopied: isCopied,
    copyText: copyText,
    copy: copy,
    cut: cut,
    clear: clear
  };
};

var _default = useClipboardCopy;
exports.default = _default;
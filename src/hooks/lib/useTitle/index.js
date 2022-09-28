"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var useTitle = function useTitle(title) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var defaultTitle = options.defaultTitle,
      prefix = options.prefix,
      suffix = options.suffix,
      onChange = options.onChange;
  var allDeps = [title, defaultTitle, prefix, suffix].concat(_toConsumableArray(deps));

  var changeTitle = function changeTitle(title) {
    var oldTitle = document.title;
    document.title = title;

    if (onChange) {
      onChange(title, oldTitle);
    }
  };

  var effectFn = _async(function () {
    var newTitle;
    return _invoke(function () {
      if (title) {
        return _await(typeof title === 'string' ? title : title(), function (_title) {
          newTitle = _title;
        }, typeof title === 'string');
      }
    }, function () {
      if (!newTitle) {
        changeTitle(defaultTitle || document.title);
      } else {
        changeTitle("".concat(prefix || '').concat(newTitle).concat(suffix || ''));
      }
    });
  });

  (0, _react.useEffect)(function () {
    effectFn();
    return function () {
      changeTitle(defaultTitle || document.title);
    };
  }, allDeps);
};

var _default = useTitle;
exports.default = _default;
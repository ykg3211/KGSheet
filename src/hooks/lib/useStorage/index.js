"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function isFunction(obj) {
  return typeof obj === 'function';
}

var mockStorage = {
  getItem: function getItem() {},
  setItem: function setItem() {},
  removeItem: function removeItem() {}
};

function useStorage(key, defaultValue, storage, raw) {
  if (!storage) {
    storage = typeof window === 'undefined' ? mockStorage : localStorage;
  }

  var getStorageState = function getStorageState() {
    try {
      var storageValue = storage.getItem(key);

      if (typeof storageValue !== 'string') {
        storage.setItem(key, raw ? String(defaultValue) : JSON.stringify(defaultValue));
        return defaultValue;
      }

      return raw ? storageValue : JSON.parse(storageValue);
    } catch (error) {
      console.warn("@byted/hooks: ".concat(error));
      return defaultValue;
    }
  };

  var _useState = (0, _react.useState)(function () {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    return getStorageState();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setInnerState = _useState2[1];

  var setState = (0, _react.useCallback)(function (newState) {
    if (newState === undefined) {
      storage.removeItem(key);
    } else if (isFunction(newState)) {
      newState = newState(getStorageState());
      storage.setItem(key, raw ? String(newState) : JSON.stringify(newState));
    } else {
      storage.setItem(key, raw ? String(newState) : JSON.stringify(newState));
    }

    return setInnerState(newState);
  }, [setInnerState, raw]);
  (0, _react.useEffect)(function () {
    var handleStorage = function handleStorage(ev) {
      var evKey = ev.key,
          newValue = ev.newValue,
          storageArea = ev.storageArea;

      if (evKey === key && storageArea === storage) {
        try {
          if (typeof newValue === 'string') {
            setInnerState(raw ? newValue : JSON.parse(newValue));
          } else {
            setInnerState(defaultValue);
          }
        } catch (error) {
          console.warn("@byted/hooks: ".concat(error));
          setInnerState(defaultValue);
        }
      }
    };

    window.addEventListener('storage', handleStorage, false);
    return function () {
      window.removeEventListener('storage', handleStorage, false);
    };
  }, [key, defaultValue, storage, raw]);
  return [state, setState];
}

;
var _default = useStorage;
exports.default = _default;
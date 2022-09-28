function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useCallback } from 'react';
import * as Cookies from 'js-cookie';

function isFunction(obj) {
  return typeof obj === 'function';
}

var useCookie = function useCookie(key, defaultValue) {
  var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var getCookieState = function getCookieState() {
    try {
      var cookieValue = Cookies.get(key);

      if (typeof cookieValue !== 'string') {
        if (defaultValue) {
          Cookies.set(key, raw ? String(defaultValue) : JSON.stringify(defaultValue));
        }

        return defaultValue;
      }

      return raw ? cookieValue : JSON.parse(cookieValue);
    } catch (_unused) {
      return defaultValue;
    }
  };

  var _useState = useState(function () {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    return getCookieState();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setInnerState = _useState2[1];

  var setState = useCallback(function (newState, options) {
    if (newState === undefined) {
      Cookies.remove(key, options);
    } else if (isFunction(newState)) {
      newState = newState(getCookieState());

      if (newState) {
        Cookies.set(key, raw ? String(newState) : JSON.stringify(newState), options);
      } else {
        Cookies.remove(key, options);
      }
    } else {
      Cookies.set(key, raw ? String(newState) : JSON.stringify(newState), options);
    }

    return setInnerState(newState);
  }, [setInnerState, raw]);
  return [state, setState];
};

export default useCookie;
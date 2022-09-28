function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { useEffect, useCallback, useRef } from 'react';

var useInterval = function useInterval(callback, delay) {
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$deps = options.deps,
      deps = _options$deps === void 0 ? [] : _options$deps;
  var timerRef = useRef();
  var savedCallback = useRef(callback);
  var run = useCallback(function () {
    cancel();

    function tick() {
      savedCallback.current();
    }

    timerRef.current = window.setInterval(tick, delay);
  }, [delay].concat(_toConsumableArray(deps)));
  var cancel = useCallback(function () {
    clearInterval(timerRef.current);
  }, []);
  useEffect(function () {
    savedCallback.current = callback;

    if (immediate) {
      run();
    }

    return function () {
      return cancel();
    };
  }, [savedCallback, delay, immediate].concat(_toConsumableArray(deps)));
  return {
    run: run,
    cancel: cancel
  };
};

export default useInterval;
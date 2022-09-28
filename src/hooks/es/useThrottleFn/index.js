function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { useCallback, useEffect, useRef } from 'react';
import useUpdateEffect from '../useUpdateEffect';

function useThrottleFn(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$immediately = options.immediately,
      immediately = _options$immediately === void 0 ? false : _options$immediately,
      _options$trailing = options.trailing,
      trailing = _options$trailing === void 0 ? true : _options$trailing,
      _options$leading = options.leading,
      leading = _options$leading === void 0 ? false : _options$leading;
  var _deps = deps;
  var _wait = wait;
  var timer = useRef();
  var haveRun = useRef(false);
  var fnRef = useRef(fn);
  fnRef.current = fn;
  var currentArgs = useRef([]);

  var setTimer = function setTimer(trailing) {
    return window.setTimeout(function () {
      trailing ? fnRef.current.apply(fnRef, _toConsumableArray(currentArgs.current)) : null;
      timer.current = undefined;
      haveRun.current = false;
    }, _wait);
  };

  var cancel = useCallback(function () {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = undefined;
  }, []);
  var run = useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    currentArgs.current = args;

    if (!timer.current) {
      if (immediately && !haveRun.current) {
        fnRef.current.apply(fnRef, _toConsumableArray(currentArgs.current));
        haveRun.current = true;
        return;
      }

      leading ? fnRef.current.apply(fnRef, _toConsumableArray(currentArgs.current)) : null;
      timer.current = setTimer(trailing);
    }
  }, [_wait, cancel]);
  useUpdateEffect(function () {
    run();
  }, [].concat(_toConsumableArray(_deps), [run]));
  useEffect(function () {
    return cancel;
  }, []);
  return {
    run: run,
    cancel: cancel
  };
}

export default useThrottleFn;
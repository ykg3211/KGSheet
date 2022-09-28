function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useCallback, useRef, useLayoutEffect } from 'react';

var useHover = function useHover(el) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var onEnter = options.onEnter,
      onLeave = options.onLeave;
  var ref = useRef();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isHovered = _useState2[0],
      setIsHovered = _useState2[1];

  var handleMouseEnter = useCallback(function () {
    if (onEnter) onEnter();
    setIsHovered(true);
  }, [typeof onEnter === 'function']);
  var handleMouseLeave = useCallback(function () {
    if (onLeave) onLeave();
    setIsHovered(false);
  }, [typeof onLeave === 'function']);
  useLayoutEffect(function () {
    var target = ref.current;

    if (el) {
      target = typeof el === 'function' ? el() : el;
    }

    if (!target) return;
    target.addEventListener('mouseenter', handleMouseEnter);
    target.addEventListener('mouseleave', handleMouseLeave);
    return function () {
      var _target, _target2;

      (_target = target) === null || _target === void 0 ? void 0 : _target.removeEventListener('mouseenter', handleMouseEnter);
      (_target2 = target) === null || _target2 === void 0 ? void 0 : _target2.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref.current, typeof el === 'function' ? undefined : el].concat(_toConsumableArray(deps)));
  return [ref, isHovered];
};

export default useHover;
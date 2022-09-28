function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { useCallback } from 'react';
import { useActionsNative } from '../useActions';

var clone = function clone(set) {
  return new Set(set.values());
};

var createActions = function createActions() {
  return {
    add: function add(state, item) {
      if (state.has(item)) {
        return state;
      }

      return clone(state).add(item);
    },
    addAll: function addAll(state, items) {
      var output = clone(state);

      var _iterator = _createForOfIteratorHelper(items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _item = _step.value;
          output.add(_item);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return output;
    },
    delete: function _delete(state, item) {
      if (state.has(item)) {
        var output = clone(state);
        output.delete(item);
        return output;
      }

      return state;
    },
    deleteAll: function deleteAll(state, items) {
      var output = clone(state);

      var _iterator2 = _createForOfIteratorHelper(items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _item2 = _step2.value;
          output.delete(_item2);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return output;
    },
    toggle: function toggle(state, item) {
      if (state.has(item)) {
        var output = clone(state);
        output.delete(item);
        return output;
      }

      return clone(state).add(item);
    },
    toggleAll: function toggleAll(state, items) {
      var output = clone(state);

      var _iterator3 = _createForOfIteratorHelper(items),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _item3 = _step3.value;

          if (output.has(_item3)) {
            output.delete(_item3);
          } else {
            output.add(_item3);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return output;
    },
    map: function map(state, iteratee) {
      var output = new Set();

      var _iterator4 = _createForOfIteratorHelper(state),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _item4 = _step4.value;
          output.add(iteratee(_item4));
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return output;
    },
    filter: function filter(state, predicate) {
      var output = new Set();

      var _iterator5 = _createForOfIteratorHelper(state),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _item5 = _step5.value;

          if (predicate(_item5)) {
            output.add(_item5);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return output;
    },
    union: function union(state, other) {
      return new Set([].concat(_toConsumableArray(state.values()), _toConsumableArray(other.values())));
    },
    intersect: function intersect(state, other) {
      return new Set(_toConsumableArray(state.values()).filter(function (v) {
        return other.has(v);
      }));
    },
    difference: function difference(state, other) {
      return new Set(_toConsumableArray(state.values()).filter(function (v) {
        return !other.has(v);
      }));
    },
    clear: function clear() {
      return new Set();
    }
  };
};

export default function useSet() {
  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _useActionsNative = useActionsNative(createActions(), function () {
    return new Set(initialValue);
  }),
      _useActionsNative2 = _slicedToArray(_useActionsNative, 4),
      state = _useActionsNative2[0],
      boundActions = _useActionsNative2[1],
      setStateInner = _useActionsNative2[2],
      reset = _useActionsNative2[3];

  var setState = useCallback(function (value) {
    setStateInner(new Set(value));
  }, []);
  return _objectSpread({
    state: state,
    setState: setState,
    reset: reset
  }, boundActions);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _useActions3 = _interopRequireDefault(require("../useActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createActions() {
  return {
    set: function set(state, key, value) {
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, key, value));
    },
    delete: function _delete(state, key) {
      var output = _objectSpread({}, state);

      delete output[key];
      return output;
    },
    deleteAll: function deleteAll(state, keys) {
      var output = _objectSpread({}, state);

      var _iterator = _createForOfIteratorHelper(keys),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _key = _step.value;
          delete output[_key];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return output;
    },
    map: function map(state, iteratee) {
      var output = _objectSpread({}, state);

      for (var _i = 0, _Object$entries = Object.entries(state); _i < _Object$entries.length; _i++) {
        var _item = _Object$entries[_i];
        output[_item[0]] = iteratee(_item);
      }

      return output;
    },
    filter: function filter(state, predicate) {
      var output = {};

      for (var _i2 = 0, _Object$entries2 = Object.entries(state); _i2 < _Object$entries2.length; _i2++) {
        var _item2 = _Object$entries2[_i2];

        if (predicate(_item2)) {
          output[_item2[0]] = _item2[1];
        }
      }

      return output;
    },
    union: function union(state, other) {
      var output = _objectSpread({}, state);

      for (var _i3 = 0, _Object$entries3 = Object.entries(other); _i3 < _Object$entries3.length; _i3++) {
        var _item3 = _Object$entries3[_i3];
        output[_item3[0]] = _item3[1];
      }

      return output;
    },
    intersect: function intersect(state, other) {
      var output = {};

      for (var _i4 = 0, _Object$entries4 = Object.entries(other); _i4 < _Object$entries4.length; _i4++) {
        var _item4 = _Object$entries4[_i4];

        if (typeof state[_item4[0]] !== 'undefined') {
          output[_item4[0]] = _item4[1];
        }
      }

      return output;
    },
    difference: function difference(state, other) {
      var output = {};

      for (var _i5 = 0, _Object$entries5 = Object.entries(other); _i5 < _Object$entries5.length; _i5++) {
        var _item5 = _Object$entries5[_i5];

        if (typeof state[_item5[0]] === 'undefined') {
          output[_item5[0]] = _item5[1];
        }
      }

      return output;
    },
    clear: function clear() {
      return {};
    }
  };
} // an interface managing Type of all actions that operate object


function useObject(initialValue) {
  var _useActions = (0, _useActions3.default)(createActions(), initialValue || {}),
      _useActions2 = _slicedToArray(_useActions, 4),
      state = _useActions2[0],
      boundActions = _useActions2[1],
      setState = _useActions2[2],
      reset = _useActions2[3];

  return _objectSpread({
    state: state,
    setState: setState,
    reset: reset,
    merge: boundActions.union
  }, boundActions);
}

var _default = useObject;
exports.default = _default;
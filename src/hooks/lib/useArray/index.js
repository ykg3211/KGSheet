"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useArray;

var _useActions3 = _interopRequireDefault(require("../useActions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createActions = function createActions() {
  return {
    push: function push(state, item) {
      state.push(item);
    },
    unshift: function unshift(state, item) {
      state.unshift(item);
    },
    pop: function pop(state) {
      if (state.length !== 0) {
        state.splice(state.length - 1, 1);
      }
    },
    shift: function shift(state) {
      if (state.length !== 0) {
        state.splice(0, 1);
      }
    },
    slice: function slice(state, start, end) {
      return state.slice(start, end);
    },
    splice: function splice(state, index, deleteCount) {
      for (var _len = arguments.length, insertions = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        insertions[_key - 3] = arguments[_key];
      }

      state.splice.apply(state, [index, deleteCount].concat(insertions));
    },
    remove: function remove(state, item) {
      return state.filter(function (v) {
        return v !== item;
      });
    },
    removeAt: function removeAt(state, index) {
      state.splice(index, 1);
    },
    insertAt: function insertAt(state, index, item) {
      state.splice(index, 0, item);
    },
    concat: function concat(state, item) {
      return state.concat(item);
    },
    replace: function replace(state, from, to) {
      var index = state.indexOf(from);

      if (index >= 0) {
        state.splice(index, 1, to);
      }
    },
    replaceAll: function replaceAll(state, from, to) {
      var has = state.includes(from);
      return has ? state.map(function (v) {
        return v === from ? to : v;
      }) : state;
    },
    replaceAt: function replaceAt(state, index, item) {
      state.splice(index, 1, item);
    },
    updateAt: function updateAt(state, index, item) {
      state.splice(index, 1, item);
    },
    map: function map(state, iteratee) {
      return state.map(iteratee);
    },
    filter: function filter(state, predicate) {
      return state.filter(predicate);
    },
    union: function union(state, array) {
      return [].concat(_toConsumableArray(state), _toConsumableArray(array));
    },
    intersect: function intersect(state, array) {
      var coming = new Set(array);
      return state.filter(function (v) {
        return coming.has(v);
      });
    },
    difference: function difference(state, array) {
      var coming = new Set(array);
      return state.filter(function (v) {
        return !coming.has(v);
      });
    },
    reverse: function reverse(state) {
      return state.slice().reverse();
    },
    sort: function sort(state, compare) {
      return state.slice().sort(compare);
    },
    clear: function clear() {
      return [];
    }
  };
};

function useArray() {
  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _useActions = (0, _useActions3.default)(createActions(), initialValue),
      _useActions2 = _slicedToArray(_useActions, 4),
      state = _useActions2[0],
      boundActions = _useActions2[1],
      setState = _useActions2[2],
      reset = _useActions2[3];

  return _objectSpread({
    state: state,
    setState: setState,
    reset: reset
  }, boundActions);
}
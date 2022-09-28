function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { useReducer, useCallback } from 'react';
export var ACTION_TYPE;

(function (ACTION_TYPE) {
  ACTION_TYPE[ACTION_TYPE["UNDO"] = 0] = "UNDO";
  ACTION_TYPE[ACTION_TYPE["REDO"] = 1] = "REDO";
  ACTION_TYPE[ACTION_TYPE["SET"] = 2] = "SET";
  ACTION_TYPE[ACTION_TYPE["CLEAR"] = 3] = "CLEAR";
})(ACTION_TYPE || (ACTION_TYPE = {}));

var initialState = {
  past: [],
  present: {},
  future: []
};

var reducer = function reducer(state, action) {
  var past = state.past,
      present = state.present,
      future = state.future;

  switch (action.type) {
    case ACTION_TYPE.UNDO:
      var previous = past[past.length - 1];
      var newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present].concat(_toConsumableArray(future))
      };

    case ACTION_TYPE.REDO:
      var next = future[0];
      var newFuture = future.slice(1);
      return {
        past: [].concat(_toConsumableArray(past), [present]),
        present: next,
        future: newFuture
      };

    case ACTION_TYPE.SET:
      var _newPresent = action.newPresent;

      if (_newPresent === present) {
        return state;
      }

      return {
        past: [].concat(_toConsumableArray(past), [present]),
        present: _newPresent,
        future: []
      };

    case ACTION_TYPE.CLEAR:
      var initialPresent = action.initialPresent;
      return _objectSpread(_objectSpread({}, initialState), {}, {
        present: initialPresent
      });
  }
}; // Hook


function useHistory(initialPresent) {
  var _useReducer = useReducer(reducer, _objectSpread(_objectSpread({}, initialState), {}, {
    present: initialPresent
  })),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var canUndo = state.past.length !== 0;
  var canRedo = state.future.length !== 0;
  var undo = useCallback(function () {
    if (canUndo) {
      dispatch({
        type: ACTION_TYPE.UNDO
      });
    }
  }, [canUndo, dispatch]);
  var redo = useCallback(function () {
    if (canRedo) {
      dispatch({
        type: ACTION_TYPE.REDO
      });
    }
  }, [canRedo, dispatch]);
  var set = useCallback(function (newPresent) {
    return dispatch({
      type: ACTION_TYPE.SET,
      newPresent: newPresent
    });
  }, [dispatch]);
  var clear = useCallback(function () {
    return dispatch({
      type: ACTION_TYPE.CLEAR,
      initialPresent: initialPresent
    });
  }, [dispatch]);
  return {
    state: state.present,
    set: set,
    undo: undo,
    redo: redo,
    clear: clear,
    canUndo: canUndo,
    canRedo: canRedo
  };
}

export default useHistory;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { useRef, useCallback } from 'react';
import { useImmerState } from '../useImmer';
export function useActionsExtension(reducers, setState) {
  var actionsRef = useRef(undefined);

  if (!actionsRef.current) {
    actionsRef.current = Object.keys(reducers).reduce(function (actions, key) {
      var fn = reducers[key];

      var bound = function bound() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return setState(function (s) {
          return fn.apply(void 0, [s].concat(args));
        });
      };

      Object.assign(actions, _defineProperty({}, key, bound));
      return actions;
    }, {});
  }

  return actionsRef.current;
}
export function useActions(reducers, initialState) {
  var _useImmerState = useImmerState(initialState),
      _useImmerState2 = _slicedToArray(_useImmerState, 2),
      state = _useImmerState2[0],
      setState = _useImmerState2[1];

  var boundActions = useActionsExtension(reducers, setState);
  var reset = useCallback(function () {
    setState(initialState);
  }, []);
  return [state, boundActions, setState, reset];
}
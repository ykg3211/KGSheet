function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useCallback } from 'react'; // 内部 state 改变，要触发 props.onChange(state)
// 外部 value 改变，要设置内部 state

function useControlled() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _defaultValue = options.defaultValue,
      _options$defaultValue = options.defaultValuePropName,
      defaultValuePropName = _options$defaultValue === void 0 ? 'defaultValue' : _options$defaultValue,
      _options$valuePropNam = options.valuePropName,
      valuePropName = _options$valuePropNam === void 0 ? 'value' : _options$valuePropNam,
      _options$onChangeProp = options.onChangePropName,
      onChangePropName = _options$onChangeProp === void 0 ? 'onChange' : _options$onChangeProp;
  var propValue = props[valuePropName];
  var propOnChange = props[onChangePropName];
  var defaultValue = defaultValuePropName in props ? props[defaultValuePropName] : _defaultValue;
  var isControlled = (valuePropName in props);

  var _useState = useState(function () {
    return isControlled ? propValue : defaultValue;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      innerState = _useState2[0],
      setInnerState = _useState2[1];

  var state = isControlled ? propValue : innerState;
  var setState = useCallback(function (state) {
    setInnerState(state);

    if (propOnChange) {
      for (var _len = arguments.length, otherParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherParams[_key - 1] = arguments[_key];
      }

      propOnChange.apply(void 0, [state].concat(otherParams));
    }
  }, [propOnChange]);
  return [state, setState];
}

;
export default useControlled;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import queryString from 'query-string';
import _omit from 'lodash.omit';
import useBoolean from '../useBoolean';
var _toString = Object.prototype.toString;

function isObject(val) {
  return val !== null && _typeof(val) === 'object';
}

function isDate(val) {
  return _toString.call(val) === '[object Date]';
}

function formatValueFn(obj, autoFormat) {
  if (autoFormat) {
    var formatValue = {};

    for (var _key in obj) {
      var val = obj[_key];

      if (val === '' || val === undefined || val === null) {
        continue;
      }

      if (Array.isArray(val)) {
        formatValue[_key] = val;
      } else if (isDate(val)) {
        formatValue[_key] = val.toISOString();
      } else if (isObject(val)) {
        formatValue[_key] = JSON.stringify(val);
      } else {
        formatValue[_key] = val;
      }
    }

    return formatValue;
  } else {
    return obj;
  }
} // 第一次初始化是 url merge defaultValue ，然后后续 setValue 用 value merge url


function getMergeValue(value, parseOptions, autoMergeUrlParams, isFirstMerged) {
  var mergeValue = isObject(value) ? _objectSpread({}, value) : {};

  if (autoMergeUrlParams) {
    if (isFirstMerged) {
      mergeValue = Object.assign(mergeValue, queryString.parse(window.location.search, parseOptions));
    } else {
      mergeValue = Object.assign(queryString.parse(window.location.search, parseOptions), mergeValue);
    }
  }

  return mergeValue;
} // 初始化 initValue 其中的 value 值可能会有 number 类型, 会被在 url 转成 Object 全部转换成 string, 需自行处理下
// The value in the initialization initValue may be a number,
// which will be converted into an Object in the url and all converted into a string, which needs to be processed manually.


function useUrlParams() {
  var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 ? arguments[1] : undefined;

  var _Object$assign = Object.assign({
    omitKeys: [],
    autoFormat: false,
    autoMergeUrlParams: true,
    parseOptions: {
      arrayFormat: 'bracket'
    },
    stringifyOptions: {
      skipNull: true,
      skipEmptyString: true,
      arrayFormat: 'bracket'
    },
    replaceUrl: true
  }, options),
      omitKeys = _Object$assign.omitKeys,
      autoFormat = _Object$assign.autoFormat,
      autoMergeUrlParams = _Object$assign.autoMergeUrlParams,
      parseOptions = _Object$assign.parseOptions,
      stringifyOptions = _Object$assign.stringifyOptions,
      replaceUrl = _Object$assign.replaceUrl;

  var _useState = useState(getMergeValue(initValue, parseOptions, autoMergeUrlParams, true)),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useBoolean = useBoolean(false),
      isPopping = _useBoolean.state,
      setPoppingTrue = _useBoolean.setTrue,
      setPoppingFalse = _useBoolean.setFalse;

  var initialValueRef = useRef(value);
  var isFirstMerged = useRef(true);
  var resetParams = useCallback(function () {
    var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (initial) {
      setValue(initialValueRef.current);
    } else {
      setValue(queryString.parse(window.location.search, parseOptions));
    }
  }, []);
  var formatValue = useMemo(function () {
    return formatValueFn(value, autoFormat);
  }, [value]);
  useEffect(function () {
    var fn = function fn() {
      setPoppingTrue();
    };

    window.addEventListener('popstate', fn);
    return function () {
      window.removeEventListener('popstate', fn);
    };
  }, []);
  useEffect(function () {
    if (isPopping) {
      setValue(queryString.parse(window.location.search, parseOptions));
    }
  }, [isPopping]);
  useEffect(function () {
    try {
      var _window$location = window.location,
          href = _window$location.href,
          search = _window$location.search,
          hash = _window$location.hash;
      var mergeValue;

      if (isFirstMerged.current) {
        isFirstMerged.current = false;
        mergeValue = formatValue;
      } else {
        mergeValue = getMergeValue(formatValue, parseOptions, autoMergeUrlParams, isFirstMerged.current);
      }

      var searchStr = queryString.stringify(_omit(mergeValue, omitKeys), stringifyOptions);
      var url = "".concat(href.replace(hash, '').replace(search, '')).concat(searchStr ? "?".concat(searchStr) : '').concat(hash);

      if (replaceUrl) {
        window.history.replaceState({
          url: url,
          title: document.title
        }, document.title, url);
      } else if (!isPopping) {
        window.history.pushState({
          url: url,
          title: document.title
        }, document.title, url);
      } else {
        // we are popping state, reset to false
        setPoppingFalse();
      }
    } catch (e) {
      throw new Error(e);
    }
  }, [formatValue]);
  return {
    value: formatValue,
    setValue: setValue,
    resetParams: resetParams
  };
}

export default useUrlParams;
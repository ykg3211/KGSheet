"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _useUpdateEffect = _interopRequireDefault(require("../useUpdateEffect"));

var _usePersistCallback = _interopRequireDefault(require("../usePersistCallback"));

var _useSemiPagination = _interopRequireDefault(require("../useSemiPagination"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function useSemiTable(requestFn) {
  var _options$defaultParam;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var formApiRef = options.formApiRef,
      _options$resetDeps = options.resetDeps,
      resetDeps = _options$resetDeps === void 0 ? [] : _options$resetDeps,
      _options$refreshDeps = options.refreshDeps,
      refreshDeps = _options$refreshDeps === void 0 ? [] : _options$refreshDeps,
      _options$defaultType = options.defaultType,
      defaultType = _options$defaultType === void 0 ? 'simple' : _options$defaultType,
      restOptions = _objectWithoutProperties(options, ["formApiRef", "resetDeps", "refreshDeps", "defaultType"]);

  var auto = typeof restOptions.auto !== 'boolean' ? true : restOptions.auto;
  var baseDefaultParams = {
    current: options.initCurrent || 1,
    pageSize: options.defaultPageSize || 10
  };
  var defaultParams = [_objectSpread(_objectSpread({}, baseDefaultParams), ((_options$defaultParam = options.defaultParams) === null || _options$defaultParam === void 0 ? void 0 : _options$defaultParam[0]) || {})].concat(_toConsumableArray((options.defaultParams || []).slice(1)));
  var result = (0, _useSemiPagination.default)(requestFn, _objectSpread(_objectSpread({}, restOptions), {}, {
    defaultParams: defaultParams,
    auto: false
  }));
  var params = result.params,
      run = result.run;
  var cacheFormTableData = params[2] || {}; // 优先从缓存中读

  var _useState = (0, _react.useState)(cacheFormTableData.type || defaultType),
      _useState2 = _slicedToArray(_useState, 2),
      type = _useState2[0],
      setType = _useState2[1]; // 全量 form 数据，包括 simple 和 advance


  var _useState3 = (0, _react.useState)(cacheFormTableData.allFormData || defaultParams && defaultParams[1] || {}),
      _useState4 = _slicedToArray(_useState3, 2),
      allFormData = _useState4[0],
      setAllFormData = _useState4[1]; // 获取当前展示的 form 字段值


  var getActiveFieldValues = (0, _react.useCallback)(function () {
    if (!(formApiRef !== null && formApiRef !== void 0 && formApiRef.current)) {
      return {};
    }

    return formApiRef.current.getValues(null, function () {
      return true;
    });
  }, [formApiRef === null || formApiRef === void 0 ? void 0 : formApiRef.current]);
  /* 初始化，或改变了 searchType, 恢复表单数据 */

  (0, _react.useEffect)(function () {
    if (!(formApiRef !== null && formApiRef !== void 0 && formApiRef.current)) {
      return;
    }

    formApiRef.current.setValues(allFormData);
  }, [type]); // 首次加载，手动提交。为了拿到 form 的 initial values

  (0, _react.useEffect)(function () {
    // 如果有缓存，则使用缓存，重新请求
    if (params.length > 0) {
      run.apply(void 0, _toConsumableArray(params));
      return;
    } // 如果没有缓存，触发 submit


    if (auto) {
      _submit(defaultParams, true);
    }
  }, []);
  var changeType = (0, _react.useCallback)(function () {
    var currentFormData = getActiveFieldValues();
    setAllFormData(_objectSpread(_objectSpread({}, allFormData), currentFormData));
    var targetType = type === 'simple' ? 'advance' : 'simple';
    setType(targetType);
  }, [type, allFormData, getActiveFieldValues]);

  var _submit = (0, _react.useCallback)(function (initParams) {
    var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    setTimeout(function () {
      var activeFormData = getActiveFieldValues(); // 记录全量数据

      var _allFormData = _objectSpread(_objectSpread({}, allFormData), activeFormData);

      setAllFormData(_allFormData); // 是否为重新搜索或重置

      var paginationParams = {};

      if (!first && !options.noResetCurrent) {
        paginationParams.current = 1;
      } // has defaultParams


      if (initParams) {
        run(_objectSpread(_objectSpread(_objectSpread({}, baseDefaultParams), initParams[0] || {}), paginationParams), activeFormData, {
          allFormData: _allFormData,
          type: type
        });
        return;
      }

      run(_objectSpread(_objectSpread(_objectSpread({}, baseDefaultParams), params[0] || defaultParams[0] || {}), paginationParams), activeFormData, {
        allFormData: _allFormData,
        type: type
      });
    });
  }, [getActiveFieldValues, run, params, allFormData, type]);

  var reset = (0, _react.useCallback)(function () {
    if (formApiRef !== null && formApiRef !== void 0 && formApiRef.current && !options.noResetForm) {
      formApiRef.current.reset();
    }

    _submit(defaultParams, false);
  }, [formApiRef === null || formApiRef === void 0 ? void 0 : formApiRef.current, _submit]);
  var resetPersistCallback = (0, _usePersistCallback.default)(reset); // resetDeps 变化，reset
  // TODO 修正 refreshDeps 逻辑

  (0, _useUpdateEffect.default)(function () {
    if (auto) {
      resetPersistCallback();
    }
  }, [].concat(_toConsumableArray(resetDeps), _toConsumableArray(refreshDeps)));
  var submit = (0, _usePersistCallback.default)(function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    _submit();
  });
  return _objectSpread(_objectSpread({}, result), {}, {
    search: {
      submit: submit,
      type: type,
      changeType: changeType,
      reset: reset
    }
  });
}

var _default = useSemiTable;
exports.default = _default;
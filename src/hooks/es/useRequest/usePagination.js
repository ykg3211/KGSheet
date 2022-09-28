function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

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

import { useCallback, useMemo, useRef } from 'react';
import useUpdateEffect from '../useUpdateEffect';
import useBaseRequest from './useBaseRequest';

function usePagination(requestFn) {
  var _restOptions$defaultP;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _options$defaultPageS = options.defaultPageSize,
      defaultPageSize = _options$defaultPageS === void 0 ? 10 : _options$defaultPageS,
      _options$initCurrent = options.initCurrent,
      initCurrent = _options$initCurrent === void 0 ? 1 : _options$initCurrent,
      _options$resetFirst = options.resetFirst,
      resetFirst = _options$resetFirst === void 0 ? false : _options$resetFirst,
      _options$resetDeps = options.resetDeps,
      resetDeps = _options$resetDeps === void 0 ? [] : _options$resetDeps,
      _options$refreshDeps = options.refreshDeps,
      refreshDeps = _options$refreshDeps === void 0 ? [] : _options$refreshDeps,
      requestKey = options.requestKey,
      restOptions = _objectWithoutProperties(options, ["defaultPageSize", "initCurrent", "resetFirst", "resetDeps", "refreshDeps", "requestKey"]);

  var pageSizeControlled = options.pageSize;
  var currentControlled = options.current;
  var auto = typeof restOptions.auto !== 'boolean' ? true : restOptions.auto;
  var defaultParams = [_objectSpread({
    current: initCurrent,
    pageSize: defaultPageSize
  }, ((_restOptions$defaultP = restOptions.defaultParams) === null || _restOptions$defaultP === void 0 ? void 0 : _restOptions$defaultP[0]) || {})].concat(_toConsumableArray((restOptions.defaultParams || []).slice(1)));
  var results = useBaseRequest(requestFn, _objectSpread(_objectSpread({}, restOptions), {}, {
    defaultParams: defaultParams,
    auto: auto
  }));
  var data = results.data,
      params = results.params,
      run = results.run,
      loading = results.loading;

  var _ref = params && params[0] ? params[0] : defaultParams[0] || {},
      _ref$current = _ref.current,
      current = _ref$current === void 0 ? initCurrent : _ref$current,
      _ref$pageSize = _ref.pageSize,
      pageSize = _ref$pageSize === void 0 ? defaultPageSize : _ref$pageSize,
      _ref$sorter = _ref.sorter,
      sorter = _ref$sorter === void 0 ? {} : _ref$sorter,
      _ref$filters = _ref.filters,
      filters = _ref$filters === void 0 ? {} : _ref$filters;

  if (pageSizeControlled) {
    pageSize = pageSizeControlled;
  }

  if (currentControlled) {
    current = currentControlled;
  } // 只改变 pagination，其他参数原样传递


  var runChangePaination = useCallback(function (paginationParams) {
    var _params = _toArray(params),
        oldPaginationParams = _params[0],
        restParams = _params.slice(1); // const { current: oldCurrent, ...restOldParams} = oldPaginationParams;
    // let { current: newCurrent, ...restNewParams} = paginationParams;
    // // Sorter & filter check. If filters or sorter changed, current page would be set to 1.
    // if(restOldParams.filters && JSON.stringify(restOldParams) !== JSON.stringify(restNewParams)) paginationParams.current = 1;


    return run.apply(void 0, [_objectSpread(_objectSpread({}, oldPaginationParams), paginationParams)].concat(_toConsumableArray(restParams)));
  }, [run, params]);
  var total = (data === null || data === void 0 ? void 0 : data.total) || 0;
  var totalPage = useMemo(function () {
    return Math.ceil(total / pageSize);
  }, [pageSize, total]);
  var onChange = useCallback(function (c, p) {
    var toCurrent = c <= 0 ? 1 : c;
    var toPageSize = p <= 0 ? 1 : p;
    var tempTotalPage = Math.ceil(total / toPageSize);

    if (toCurrent > tempTotalPage) {
      toCurrent = tempTotalPage;
    }

    return runChangePaination({
      current: c,
      pageSize: p
    });
  }, [total, runChangePaination]);
  var onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  var changeCurrent = useCallback(function (c) {
    onChange(c, pageSize);
  }, [onChange, pageSize]);
  var changePageSize = useCallback(function (p) {
    onChange(current, p);
  }, [onChange, current]);
  var changeCurrentRef = useRef(changeCurrent);
  changeCurrentRef.current = changeCurrent; // TODO 修正 refreshDeps 逻辑

  useUpdateEffect(function () {
    // 只有自动执行的场景， refreshDeps 才有效
    if (auto) {
      changeCurrentRef.current(currentControlled ? currentControlled : resetFirst ? 1 : initCurrent);
    }
  }, [].concat(_toConsumableArray(resetDeps), _toConsumableArray(refreshDeps), [pageSizeControlled, currentControlled])); // 表格翻页、排序、筛选等

  var changeTable = useCallback(function (p, f, s) {
    runChangePaination({
      current: p.current === undefined ? initCurrent : p.current,
      pageSize: p.pageSize || defaultPageSize,
      filters: f,
      sorter: s
    });
  }, [runChangePaination]);
  var reset = useCallback(function () {
    run(defaultParams[0], defaultParams[1]);
  }, []);
  return _objectSpread(_objectSpread({}, results), {}, {
    reset: reset,
    loading: loading,
    data: data,
    params: params,
    pagination: {
      current: current,
      pageSize: pageSize,
      total: total,
      totalPage: totalPage,
      onChange: onChange,
      changeCurrent: changeCurrent,
      changePageSize: changePageSize
    },
    tableProps: {
      dataSource: (data === null || data === void 0 ? void 0 : data.list) || [],
      loading: loading,
      onChange: changeTable,
      pagination: {
        current: current,
        pageSize: pageSize,
        total: total
      }
    },
    sorter: sorter,
    filters: filters
  });
}

export default usePagination;
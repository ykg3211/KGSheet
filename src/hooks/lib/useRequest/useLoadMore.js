"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _useUpdateEffect = _interopRequireDefault(require("../useUpdateEffect"));

var _useBaseRequest = _interopRequireDefault(require("./useBaseRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function useLoadMore(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _options$ready = options.ready,
      ready = _options$ready === void 0 ? true : _options$ready,
      _options$resetDeps = options.resetDeps,
      resetDeps = _options$resetDeps === void 0 ? [] : _options$resetDeps,
      _options$refreshDeps = options.refreshDeps,
      refreshDeps = _options$refreshDeps === void 0 ? [] : _options$refreshDeps,
      itemKey = options.itemKey,
      _options$initPageSize = options.initPageSize,
      initPageSize = _options$initPageSize === void 0 ? 10 : _options$initPageSize,
      ref = options.ref,
      _options$threshold = options.threshold,
      threshold = _options$threshold === void 0 ? 100 : _options$threshold,
      restOptions = _objectWithoutProperties(options, ["ready", "resetDeps", "refreshDeps", "itemKey", "initPageSize", "ref", "threshold"]); // FIXME remove {isNoMore,noMore,hasMoreHanlder} in the next major version


  var hasMoreHanlder = options.hasMoreHanlder,
      isNoMore = options.isNoMore,
      hasMoreHandler = options.hasMoreHandler,
      noMoreHandler = options.noMoreHandler;
  noMoreHandler = noMoreHandler || hasMoreHandler || hasMoreHanlder || isNoMore;
  var incrementSize = options.incrementSize || initPageSize;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      loadingMore = _useState2[0],
      setLoadingMore = _useState2[1];

  var _useState3 = (0, _react.useState)(1),
      _useState4 = _slicedToArray(_useState3, 2),
      current = _useState4[0],
      setCurrent = _useState4[1];

  var preScrollTop = (0, _react.useRef)(0);
  var startTime = (0, _react.useRef)(new Date().getTime());
  var defaultParams = {
    data: {
      list: []
    },
    current: 1,
    pageSize: initPageSize,
    offset: 0,
    startTime: startTime.current
  };
  var auto = typeof restOptions.auto !== 'boolean' ? true : restOptions.auto;

  var _useState5 = (0, _react.useState)(),
      _useState6 = _slicedToArray(_useState5, 2),
      reloadShowData = _useState6[0],
      setReloadShowData = _useState6[1];

  var result = (0, _useBaseRequest.default)(requestFn, _objectSpread(_objectSpread({}, restOptions), {}, {
    ready: ready,
    auto: auto,
    defaultParams: [defaultParams],
    requestKey: function requestKey(d) {
      var _d$data, _d$data$list;

      return ((d === null || d === void 0 ? void 0 : (_d$data = d.data) === null || _d$data === void 0 ? void 0 : (_d$data$list = _d$data.list) === null || _d$data$list === void 0 ? void 0 : _d$data$list.length) || 0) + startTime.current;
    },
    onSuccess: function onSuccess() {
      var _reloadShowData$list;

      if (reloadShowData !== null && reloadShowData !== void 0 && (_reloadShowData$list = reloadShowData.list) !== null && _reloadShowData$list !== void 0 && _reloadShowData$list.length && ref && ref.current) {
        // 如果是reload的，手动将scrollTop设为0，防止因reload时旧数据没有情况导致了
        ref.current.scrollTop = 0;
      }

      setReloadShowData(undefined);
      setLoadingMore(false);
      setCurrent(function (i) {
        return i + 1;
      });

      if (options.onSuccess) {
        // @ts-ignore
        options.onSuccess.apply(options, arguments);
      }
    },
    onError: function onError() {
      setLoadingMore(false);

      if (options.onError) {
        options.onError.apply(options, arguments);
      }
    }
  }));
  var data = result.data,
      run = result.run,
      error = result.error,
      reset = result.reset,
      loading = result.loading,
      requests = result.requests; // const isReload = useRef(false)
  // 返回数据集

  var dataGroup = (0, _react.useMemo)(function () {
    var listGroup = []; // 在 loadMore 时，不希望清空上一次的 data。需要把最后一个 非 loading 的请求 data，放回去。

    var lastNoLoadingData = data || {};
    Object.keys(requests).sort(function (a, b) {
      return Number(a) - Number(b);
    }).forEach(function (k) {
      var _r$data;

      var r = requests[k];

      if ((_r$data = r.data) !== null && _r$data !== void 0 && _r$data.list) {
        var _r$data2;

        listGroup = listGroup.concat((_r$data2 = r.data) === null || _r$data2 === void 0 ? void 0 : _r$data2.list);
      }

      if (!r.loading) {
        lastNoLoadingData = r.data;
      }
    });
    return _objectSpread(_objectSpread({}, lastNoLoadingData), {}, {
      list: listGroup
    });
  }, [requests, data]);
  var noMore = Boolean(!loading && !loadingMore && (noMoreHandler ? noMoreHandler(data, error, dataGroup) : !data || !data.list.length || data.total && dataGroup.list.length >= data.total)); // 请求参数

  var getParams = (0, _react.useCallback)(function () {
    // id 模式下读取 Key
    var getItemKey = function getItemKey(item, index) {
      var key = typeof itemKey === 'function' ? itemKey(item, index) : item[itemKey];
      return key === undefined ? index : key;
    };

    var list = dataGroup.list;
    return {
      data: dataGroup,
      current: current,
      pageSize: current === 1 ? initPageSize : incrementSize,
      offset: list.length,
      id: itemKey && list.length > 0 ? getItemKey(list[list.length - 1], list.length - 1) : undefined,
      startTime: startTime.current
    };
  }, [current, initPageSize, incrementSize, dataGroup]);
  var reload = (0, _react.useCallback)(function () {
    var showData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (showData === true) {
      setReloadShowData(dataGroup);
    }

    reset();
    setCurrent(1);
    startTime.current = new Date().getTime();
    run(defaultParams);
  }, [run, reset, dataGroup]);
  var reloadRef = (0, _react.useRef)(reload);
  reloadRef.current = reload; // TODO 修正 refreshDeps 逻辑

  (0, _useUpdateEffect.default)(function () {
    // 只有自动执行的场景， refreshDeps 才有效
    if (ready && auto) {
      reloadRef.current();
    }
  }, [].concat(_toConsumableArray(resetDeps), _toConsumableArray(refreshDeps)));
  var loadMore = (0, _react.useCallback)(function () {
    var customObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    setReloadShowData(undefined);

    if (noMore || loading || loadingMore) {
      return;
    }

    setLoadingMore(true);
    var params = getParams();
    run(_objectSpread(_objectSpread({}, params), customObj));
  }, [noMore, loading, loadingMore, run, dataGroup, getParams]);
  (0, _react.useEffect)(function () {
    if (!ref || !ref.current) {
      return function () {};
    }

    var handleScroll = function handleScroll() {
      if (!ref || !ref.current) {
        return;
      }

      if ( // 解决当触发reload时，子元素高度变小引起scrollTop变化从而触发了handleScroll问题。
      // 判断只有滚动条是向下滑的话，才考虑触发loadMore
      preScrollTop.current < ref.current.scrollTop && ref.current.scrollHeight - ref.current.scrollTop <= ref.current.clientHeight + threshold) {
        loadMore();
      }

      preScrollTop.current = ref.current.scrollTop;
    };

    ref.current.addEventListener('scroll', handleScroll);
    return function () {
      if (ref && ref.current) {
        ref.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref && ref.current, loadMore]);
  var resData = (0, _react.useMemo)(function () {
    var _reloadShowData$list2;

    return reloadShowData !== null && reloadShowData !== void 0 && (_reloadShowData$list2 = reloadShowData.list) !== null && _reloadShowData$list2 !== void 0 && _reloadShowData$list2.length ? reloadShowData : dataGroup;
  }, [reloadShowData, reloadShowData, dataGroup]);
  return _objectSpread(_objectSpread({}, result), {}, {
    reset: reloadRef.current,
    current: current,
    data: resData,
    reload: reload,
    loading: loading && Boolean(reloadShowData === null || reloadShowData === void 0 ? void 0 : reloadShowData.list.length) || loading && dataGroup.list.length === 0,
    loadMore: loadMore,
    loadingMore: loadingMore,
    noMore: noMore,
    hasMore: noMore
  });
}

var _default = useLoadMore;
exports.default = _default;
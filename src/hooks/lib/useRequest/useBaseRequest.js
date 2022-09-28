"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _useUpdateEffect = _interopRequireDefault(require("../useUpdateEffect"));

var _usePersistCallback = _interopRequireDefault(require("../usePersistCallback"));

var _cache = require("./cache");

var _Request = _interopRequireDefault(require("./Request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_KEY = '_BYTED_HOOKS_DEFAULT_KEY_'; // 当 auto 为 true && requestFn 有形参,则 defaultParams 为必填项.

var useBaseRequest = function useBaseRequest(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$staleTime = options.staleTime,
      staleTime = _options$staleTime === void 0 ? 5 * 60 * 1000 : _options$staleTime;
  var _options$auto = options.auto,
      auto = _options$auto === void 0 ? false : _options$auto,
      _options$defaultParam = options.defaultParams,
      defaultParams = _options$defaultParam === void 0 ? [] : _options$defaultParam,
      _options$refreshDeps = options.refreshDeps,
      refreshDeps = _options$refreshDeps === void 0 ? [] : _options$refreshDeps,
      initData = options.initData,
      _options$ready = options.ready,
      ready = _options$ready === void 0 ? true : _options$ready,
      cacheKey = options.cacheKey,
      _options$cacheStoreTy = options.cacheStoreType,
      cacheStoreType = _options$cacheStoreTy === void 0 ? 'memory' : _options$cacheStoreTy,
      _options$cacheTime = options.cacheTime,
      cacheTime = _options$cacheTime === void 0 ? 5 * 60 * 1000 : _options$cacheTime,
      _options$loadingCheck = options.loadingCheck,
      loadingCheck = _options$loadingCheck === void 0 ? false : _options$loadingCheck,
      _options$errorCheck = options.errorCheck,
      errorCheck = _options$errorCheck === void 0 ? false : _options$errorCheck,
      formatResult = options.formatResult,
      requestKey = options.requestKey,
      onError = options.onError,
      onSuccess = options.onSuccess;
  var requestFnPersistCallback = (0, _usePersistCallback.default)(requestFn);
  var onSuccessPersistCallback = (0, _usePersistCallback.default)(onSuccess);
  var onErrorPersistCallback = (0, _usePersistCallback.default)(onError);
  var formatResultCallback = formatResult ? (0, _usePersistCallback.default)(formatResult) : undefined;
  var requestKeyCallback = (0, _usePersistCallback.default)(requestKey);
  var onChangeState = (0, _react.useCallback)(function (key, data) {
    setRequests(function (requests) {
      return _objectSpread(_objectSpread({}, requests), {}, _defineProperty({}, key, data));
    });
  }, []);
  var cacheKeyRef = (0, _react.useRef)(cacheKey);
  cacheKeyRef.current = cacheKey;
  var readyRef = (0, _react.useRef)(ready);
  readyRef.current = ready;
  var currentRequestKey = (0, _react.useRef)(DEFAULT_KEY);

  var getNewRequestByCache = function getNewRequestByCache() {
    // 如果有 缓存，则从缓存中读数据
    if (cacheKeyRef.current) {
      var _ref = (0, _cache.getCache)(cacheKeyRef.current) || {},
          data = _ref.data,
          _ref$startTime = _ref.startTime,
          startTime = _ref$startTime === void 0 ? 0 : _ref$startTime;

      var isAlive = staleTime === -1 || new Date().getTime() - startTime <= staleTime;

      if (data && isAlive) {
        currentRequestKey.current = data.currentRequestKey;
        /* 使用 initState, 重新 new Request */

        var newRequestes = {};
        Object.keys(data.requests).forEach(function (key) {
          var cacheRequest = data.requests[key];
          var newRequest = new _Request.default(requestFnPersistCallback, _objectSpread(_objectSpread({}, options), {}, {
            onSuccess: onSuccessPersistCallback,
            onError: onErrorPersistCallback,
            formatResult: formatResultCallback
          }), onChangeState.bind(null, key), {
            loading: cacheRequest.loading,
            params: cacheRequest.params,
            data: cacheRequest.data,
            error: cacheRequest.error
          });
          newRequestes[key] = newRequest.state;
        });
        return newRequestes;
      }

      return {};
    }

    return {};
  };

  var _useState = (0, _react.useState)(function () {
    if (cacheStoreType !== 'memory') {
      (0, _cache.changeCacheType)(cacheStoreType);
    }

    return getNewRequestByCache();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      requests = _useState2[0],
      setRequests = _useState2[1];

  var requestsRef = (0, _react.useRef)(requests);
  requestsRef.current = requests;
  var readyMemoryParams = (0, _react.useRef)(); // run method

  var run = (0, _react.useCallback)(function () {
    var _currentRequest;

    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    if (!ready) {
      // 没有 ready, 记录请求参数，等 ready 后，发起请求用
      readyMemoryParams.current = params;
      return;
    }

    var currentRequest;

    if (requestKey) {
      var key = requestKeyCallback.apply(void 0, params);
      currentRequestKey.current = key;
      currentRequest = requestsRef.current[key];
    } else {
      currentRequest = requestsRef.current[currentRequestKey.current];
    }

    if (!currentRequest) {
      var requestState = new _Request.default(requestFnPersistCallback, _objectSpread(_objectSpread({}, options), {}, {
        onSuccess: onSuccessPersistCallback,
        onError: onErrorPersistCallback,
        formatResult: formatResultCallback
      }), onChangeState.bind(null, currentRequestKey.current)).state;
      setRequests(function (requests) {
        return _objectSpread(_objectSpread({}, requests), {}, _defineProperty({}, currentRequestKey.current, requestState));
      });
      return requestState.run.apply(requestState, params);
    }

    return (_currentRequest = currentRequest).run.apply(_currentRequest, params);
  }, [requestKey, ready]); // cache

  (0, _useUpdateEffect.default)(function () {
    if (cacheKeyRef.current) {
      (0, _cache.setCache)(cacheKeyRef.current, cacheTime, {
        requests: requests,
        currentRequestKey: currentRequestKey.current
      });
    }
  }, [requests]); // 重置

  var reset = (0, _react.useCallback)(function () {
    Object.values(requestsRef.current).forEach(function (r) {
      r.unmount();
    });
    currentRequestKey.current = DEFAULT_KEY;
    setRequests({}); // 不写会有问题。如果不写，此时立即 run，会是老的数据

    requestsRef.current = {};
  }, [setRequests]); // Ready

  var hasTriggeredByReady = (0, _react.useRef)(false);
  (0, _useUpdateEffect.default)(function () {
    if (ready) {
      if (!hasTriggeredByReady.current && readyMemoryParams.current) {
        run.apply(void 0, _toConsumableArray(readyMemoryParams.current));
      }

      hasTriggeredByReady.current = true;
    }
  }, [ready]); // 首次执行

  (0, _react.useEffect)(function () {
    if (cacheStoreType !== 'memory') {
      (0, _cache.changeCacheType)(cacheStoreType);
    }

    if (ready && auto) {
      var newRequest = getNewRequestByCache(); // 如果有缓存，则重新请求

      if (Object.keys(newRequest).length > 0) {
        Object.values(requests).forEach(function (r) {
          r.refresh();
        });
      } else {
        // 第一次默认执行，可以通过 defaultParams 设置参数
        run.apply(void 0, _toConsumableArray(defaultParams));
      }
    }

    return function () {
      Object.values(requestsRef.current).forEach(function (r) {
        r.unmount();
      });
    };
  }, [ready]); // refreshDeps

  (0, _useUpdateEffect.default)(function () {
    // refreshDep 改变，先看有没有缓存，有缓存用缓存
    if (readyRef.current && auto) {
      var newRequest = getNewRequestByCache();

      if (Object.keys(newRequest).length === 0) {
        /* 重新执行所有的 cache */
        Object.values(requests).forEach(function (r) {
          r.refresh();
        });
      } else {
        setRequests(newRequest);
      }
    }
  }, _toConsumableArray(refreshDeps)); // refreshOptions

  var refreshOptions = [options.debounceInterval, options.throttleInterval, options.pollingInterval];
  (0, _useUpdateEffect.default)(function () {
    Object.values(requests).forEach(function (request) {
      request.refreshOptions({
        debounceInterval: options.debounceInterval,
        throttleInterval: options.throttleInterval,
        pollingInterval: options.pollingInterval
      });
    });
  }, [].concat(refreshOptions));
  var returnValue;

  if (requests[currentRequestKey.current]) {
    returnValue = _objectSpread(_objectSpread({}, requests[currentRequestKey.current]), {}, {
      run: run,
      reset: reset,
      requests: requests
    });
  } else {
    returnValue = {
      loading: auto && ready,
      isPolling: false,
      data: initData,
      error: undefined,
      params: [],
      cancel: function cancel() {},
      unmount: function unmount() {},
      reset: function reset() {},
      refresh: function () {},
      refreshOptions: function () {},
      changeData: function changeData() {},
      run: run,
      requests: requests
    };
  }

  if (typeof Proxy !== 'undefined') {
    var loadingChecked = !loadingCheck;
    var errorChecked = !errorCheck;
    return new Proxy(returnValue, {
      get: function get(target, prop, receiver) {
        if (prop === 'data') {
          if (!loadingChecked) {
            console.warn('You need to check loading before using data');
          }

          if (!errorChecked) {
            console.warn('You need to check error before using data');
          }
        } else if (prop === 'loading') {
          loadingChecked;
        } else if (prop === 'error') {
          errorChecked;
        } // @ts-ignore


        return target[prop];
      }
    });
  }

  return returnValue;
};

var _default = useBaseRequest;
exports.default = _default;
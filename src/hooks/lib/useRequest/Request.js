"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _lodash2 = _interopRequireDefault(require("lodash.throttle"));

require("core-js/modules/es.promise.finally");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 提供 Request 类,供并行请求使用
var Request = /*#__PURE__*/function () {
  // 是否卸载
  function Request(requestFn, options, onChangeState, initState) {
    _classCallCheck(this, Request);

    this.options = void 0;
    this.requestFn = void 0;
    this.debounceFn = void 0;
    this.throttleFn = void 0;
    this.pollingTimer = void 0;
    this.count = 0;
    this.unmountedFlag = false;
    this.that = this;
    this.onChangeState = void 0;
    this.state = {
      loading: false,
      run: this.run.bind(this.that),
      data: undefined,
      error: undefined,
      isPolling: false,
      cancel: this.cancel.bind(this.that),
      refresh: this.refresh.bind(this.that),
      refreshOptions: this.refreshOptions.bind(this.that),
      changeData: this.changeData.bind(this.that),
      unmount: this.unmount.bind(this.that),
      params: [] // TODO 这里为什么会推断出 nerver[]

    };
    var debounceInterval = options.debounceInterval,
        throttleInterval = options.throttleInterval,
        initData = options.initData;
    this.requestFn = requestFn;
    this.options = options;
    this.onChangeState = onChangeState;
    this.state.data = initData;

    if (initState) {
      this.state = _objectSpread(_objectSpread({}, this.state), initState);
    }

    this.pollingTimer = undefined;
    this.debounceFn = debounceInterval ? (0, _lodash.default)(this._run.bind(this.that), debounceInterval) : undefined;
    this.throttleFn = throttleInterval ? (0, _lodash2.default)(this._run.bind(this.that), throttleInterval) : undefined;
  }

  _createClass(Request, [{
    key: "setState",
    value: function setState() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.state = _objectSpread(_objectSpread({}, this.state), s);

      if (this.onChangeState) {
        this.onChangeState(this.state);
      }
    }
  }, {
    key: "cancelPolling",
    value: function cancelPolling() {
      if (this.pollingTimer !== undefined) {
        window.clearTimeout(this.pollingTimer);
        this.pollingTimer = undefined;
      }
    }
  }, {
    key: "dontPolling",
    value: function dontPolling() {
      this.setState({
        isPolling: false
      });
    }
  }, {
    key: "_run",
    value: function _run() {
      var _this = this;

      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      this.cancelPolling();
      this.count += 1; // 闭包存储当次请求的 count

      var currentCount = this.count;
      this.setState({
        loading: true,
        params: params,
        isPolling: Boolean(this.options.pollingInterval)
      });
      return this.requestFn.apply(this, params).then(function (res) {
        if (_this.unmountedFlag || currentCount !== _this.count) {
          return;
        }

        var formattedResult = _this.options.formatResult ? _this.options.formatResult(res) : res;

        _this.setState({
          loading: false,
          error: undefined,
          data: formattedResult
        });

        if (_this.options.onSuccess) {
          _this.options.onSuccess(formattedResult, params, _this.dontPolling.bind(_this.that));
        }

        return formattedResult;
      }).catch(function (error) {
        if (_this.unmountedFlag || currentCount !== _this.count) {
          return;
        }

        _this.setState({
          data: undefined,
          error: error,
          loading: false
        });

        if (_this.options.onError) {
          _this.options.onError(error, params, _this.dontPolling.bind(_this.that));
        }

        if (_this.options.throwOnError) {
          throw error;
        }

        return error;
      }).finally(function () {
        if (_this.unmountedFlag || currentCount !== _this.count) {
          return;
        }

        if (_this.options.pollingInterval && _this.state.isPolling) {
          _this.pollingTimer = window.setTimeout(function () {
            _this._run.apply(_this, params);
          }, _this.options.pollingInterval);
        }
      });
    }
  }, {
    key: "run",
    value: function run() {
      var debounceFn = this.debounceFn,
          throttleFn = this.throttleFn;
      this.unmountedFlag = false;

      if (debounceFn) {
        debounceFn.apply(void 0, arguments);
        return Promise.resolve(null); // TODO: 不需要再返回 Promise
      }

      if (throttleFn) {
        throttleFn.apply(void 0, arguments);
        return Promise.resolve(null); // TODO: 不需要再返回 Promise
      }

      return this._run.apply(this, arguments);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var debounceFn = this.debounceFn,
          throttleFn = this.throttleFn,
          pollingTimer = this.pollingTimer;

      if (debounceFn) {
        debounceFn.cancel();
      }

      if (throttleFn) {
        throttleFn.cancel();
      }

      if (pollingTimer !== undefined) {
        this.cancelPolling();
      }

      this.count += 1;
      this.setState({
        loading: false,
        isPolling: false
      });
    }
  }, {
    key: "unmount",
    value: function unmount() {
      this.unmountedFlag = true;
      this.cancel();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.unmountedFlag = false;
      return this.run.apply(this, _toConsumableArray(this.state.params));
    }
  }, {
    key: "refreshOptions",
    value: function refreshOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.options = _objectSpread(_objectSpread({}, this.options), options);
      return this.run.apply(this, _toConsumableArray(this.state.params));
    }
  }, {
    key: "changeData",
    value: function changeData(FnOrData) {
      if (typeof FnOrData === 'function') {
        this.setState({
          data: FnOrData(this.state.data) || {}
        });
      } else {
        this.setState({
          data: FnOrData
        });
      }
    }
  }]);

  return Request;
}();

var _default = Request;
exports.default = _default;
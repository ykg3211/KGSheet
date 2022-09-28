function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useMemo } from 'react';
import useScript from '../useScript';

var useTea = function useTea(appId) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$channel = options.channel,
      channel = _options$channel === void 0 ? 'cn' : _options$channel,
      _options$log = options.log,
      log = _options$log === void 0 ? false : _options$log,
      test = options.test,
      evtParams = options.evtParams,
      _options$configParams = options.configParams,
      configParams = _options$configParams === void 0 ? {} : _options$configParams,
      _options$ifMountToWin = options.ifMountToWindow,
      ifMountToWindow = _options$ifMountToWin === void 0 ? true : _options$ifMountToWin,
      _options$sendFnName = options.sendFnName,
      sendFnName = _options$sendFnName === void 0 ? 'Tea' : _options$sendFnName;
  useScript('', {
    innerHTML: "\n      (function(win, export_obj) {\n        win['TeaAnalyticsObject'] = export_obj;\n        if (!win[export_obj]) {\n            function _collect() {\n                _collect.q.push(arguments);\n            }\n            _collect.q = _collect.q || [];\n            win[export_obj] = _collect;\n        }\n        win[export_obj].l = +new Date();\n      })(window, 'collectEvent');\n    "
  });

  var _useScript = useScript('https://lf1-cdn-tos.bytescm.com/obj/static/log-sdk/collect/collect.js', {
    async: true
  }),
      _useScript2 = _slicedToArray(_useScript, 2),
      loaded = _useScript2[0],
      error = _useScript2[1];

  var send = useMemo(function () {
    // SSR
    if (typeof window === 'undefined') {
      return function () {
        console.warn('useTea: Tea has not been initialized.');
      };
    }

    if (loaded && appId) {
      window.collectEvent.init({
        app_id: Number(appId),
        // @ts-ignore
        channel: channel,
        log: log,
        // @ts-ignore
        disable_storage: 1
      });
      window.collectEvent.config(_objectSpread({
        _staging_flag: test ? 1 : 0,
        evtParams: evtParams
      }, configParams));
      window.collectEvent.start();
      return window.collectEvent;
    }

    return function () {
      console.warn('useTea: Tea has not been initialized.');
    };
  }, [loaded, appId]); // 将 send 挂在到全局
  // ifMountToWindow 用户自定义是否需要挂载到全局
  // 检测执行环境，防止服务端没有 window 会挂掉
  // 以 sendFnName 来区分不同项目对应的转换函数，防止覆盖

  if (ifMountToWindow && sendFnName && send) {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window[sendFnName] = send;
    } else if (typeof global !== 'undefined') {
      // @ts-ignore
      global[sendFnName] = send;
    }
  } // @ts-ignore


  return {
    send: send,
    loaded: loaded,
    error: error
  };
};

export default useTea;
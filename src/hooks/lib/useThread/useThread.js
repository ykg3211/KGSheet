"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _utils = require("./utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var PROMISE_RESOLVE = 'resolve';
var PROMISE_REJECT = 'reject';

var useThread = function useThread(fn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _useState = (0, _react.useState)(_utils.THREAD_TASK_STATUS.PENDING),
      _useState2 = _slicedToArray(_useState, 2),
      workerStatus = _useState2[0],
      _setWorkerStatus = _useState2[1];

  var worker = (0, _react.useRef)();
  var isRunning = (0, _react.useRef)(false);
  var promiseRef = (0, _react.useRef)({});
  var timeoutId = (0, _react.useRef)();
  var setWorkerStatus = (0, _react.useCallback)(function (status) {
    isRunning.current = status === _utils.THREAD_TASK_STATUS.RUNNING;

    _setWorkerStatus(status);
  }, []);
  var killWorker = (0, _react.useCallback)(function () {
    var _worker$current;

    if ((_worker$current = worker.current) !== null && _worker$current !== void 0 && _worker$current._url) {
      worker.current.terminate();
      URL.revokeObjectURL(worker.current._url);
      promiseRef.current = {};
      worker.current = undefined;
      window.clearTimeout(timeoutId.current);
      setWorkerStatus(_utils.THREAD_TASK_STATUS.KILLED);
    }
  }, []);
  var onWorkerEnd = (0, _react.useCallback)(function (status) {
    killWorker();
    setWorkerStatus(status);
  }, [killWorker, setWorkerStatus]);
  var generateWorker = (0, _react.useCallback)(function () {
    var remoteDependencies = options.remoteDependencies,
        timeout = options.timeout;
    var blobUrl = (0, _utils.createWorkerBlobUrl)(fn, remoteDependencies);
    var newWorker = new Worker(blobUrl);
    newWorker._url = blobUrl;

    newWorker.onmessage = function (e) {
      var _promiseRef$current$P, _promiseRef$current, _promiseRef$current$P2, _promiseRef$current2;

      var _ref = e.data,
          _ref2 = _slicedToArray(_ref, 2),
          status = _ref2[0],
          result = _ref2[1];

      switch (status) {
        case _utils.THREAD_TASK_STATUS.SUCCESS:
          (_promiseRef$current$P = (_promiseRef$current = promiseRef.current)[PROMISE_RESOLVE]) === null || _promiseRef$current$P === void 0 ? void 0 : _promiseRef$current$P.call(_promiseRef$current, result);
          onWorkerEnd(_utils.THREAD_TASK_STATUS.SUCCESS);
          break;

        default:
          (_promiseRef$current$P2 = (_promiseRef$current2 = promiseRef.current)[PROMISE_REJECT]) === null || _promiseRef$current$P2 === void 0 ? void 0 : _promiseRef$current$P2.call(_promiseRef$current2, result);
          onWorkerEnd(_utils.THREAD_TASK_STATUS.ERROR);
          break;
      }
    };

    newWorker.onerror = function (e) {
      var _promiseRef$current$P3, _promiseRef$current3;

      (_promiseRef$current$P3 = (_promiseRef$current3 = promiseRef.current)[PROMISE_REJECT]) === null || _promiseRef$current$P3 === void 0 ? void 0 : _promiseRef$current$P3.call(_promiseRef$current3, e);
      onWorkerEnd(_utils.THREAD_TASK_STATUS.ERROR);
    };

    if (timeout) {
      timeoutId.current = window.setTimeout(function () {
        killWorker();
        setWorkerStatus(_utils.THREAD_TASK_STATUS.TIMEOUT);
      }, timeout);
    }

    return newWorker;
  }, [fn, options, killWorker]);
  var runFn = (0, _react.useCallback)(function () {
    for (var _len = arguments.length, fnArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      fnArgs[_key] = arguments[_key];
    }

    if (isRunning.current) {
      console.error('[useThread] You can only run one instance of the worker at a time, if you want to run more than one in parallel, create another instance with the hook useThread(). Read more: https://github.com/alewin/useThread');
      return Promise.reject();
    }

    if (!worker.current) {
      worker.current = generateWorker();
    }

    var promise = new Promise(function (resolve, reject) {
      var _promiseRef$current4, _worker$current2;

      promiseRef.current = (_promiseRef$current4 = {}, _defineProperty(_promiseRef$current4, PROMISE_RESOLVE, resolve), _defineProperty(_promiseRef$current4, PROMISE_REJECT, reject), _promiseRef$current4);
      (_worker$current2 = worker.current) === null || _worker$current2 === void 0 ? void 0 : _worker$current2.postMessage([[].concat(fnArgs)]);
      setWorkerStatus(_utils.THREAD_TASK_STATUS.RUNNING);
    });
    return promise;
  }, [generateWorker, setWorkerStatus]);
  (0, _react.useEffect)(function () {
    return killWorker;
  }, []);
  return [runFn, workerStatus, killWorker];
};

var _default = useThread;
exports.default = _default;
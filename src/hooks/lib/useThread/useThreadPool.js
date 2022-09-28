"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _useForceUpdate = _interopRequireDefault(require("../useForceUpdate"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var useThreadPool = function useThreadPool(fn, options) {
  var forceUpdate = (0, _useForceUpdate.default)();
  var workerUrlRef = (0, _react.useRef)('');
  var workerPoolRef = (0, _react.useRef)(new Set());
  var freeWorkersRef = (0, _react.useRef)([]);
  var allTasksRef = (0, _react.useRef)(new Map());
  var pendingQueueRef = (0, _react.useRef)([]);
  var poolSize = options.size || navigator.hardwareConcurrency / 2; // 设置worker任务状态

  var setTaskStatus = (0, _react.useCallback)(function (id, status, result) {
    var task = allTasksRef.current.get(id);

    if (task) {
      task.status = status;
      task.result = result;
    }

    forceUpdate();
  }, []); // worker任务执行结束，释放当前worker，进行新任务

  var onTaskFinish = (0, _react.useCallback)(function (worker) {
    worker.onmessage = null;
    worker.onerror = null;
    freeWorkersRef.current.push(worker);

    if (pendingQueueRef.current.length) {
      startWorker.apply(void 0, _toConsumableArray(pendingQueueRef.current.shift()));
    }
  }, []); // 启动worker执行任务，若无空闲worker则进入等待队列

  var startWorker = (0, _react.useCallback)(function (resolve, reject, fnArgs, id) {
    var task = {
      status: _utils.THREAD_TASK_STATUS.PENDING,
      reject: reject
    };
    allTasksRef.current.set(id, task);

    if (freeWorkersRef.current.length) {
      var worker = freeWorkersRef.current.pop();

      worker.onmessage = function (e) {
        var _ref = e.data,
            _ref2 = _slicedToArray(_ref, 2),
            status = _ref2[0],
            result = _ref2[1];

        switch (status) {
          case _utils.THREAD_TASK_STATUS.SUCCESS:
            resolve(result);
            setTaskStatus(id, _utils.THREAD_TASK_STATUS.SUCCESS, result);
            break;

          default:
            reject(result);
            setTaskStatus(id, _utils.THREAD_TASK_STATUS.ERROR, result);
            break;
        }

        onTaskFinish(worker);
      };

      worker.onerror = function (e) {
        reject(e.error);
        setTaskStatus(id, _utils.THREAD_TASK_STATUS.ERROR);
        onTaskFinish(worker);
      };

      worker.postMessage([_toConsumableArray(fnArgs)]);
      setTaskStatus(id, _utils.THREAD_TASK_STATUS.RUNNING);
      task.worker = worker;
    } else {
      pendingQueueRef.current.push([resolve, reject, fnArgs, id]);
    }

    if (options.timeout) {
      var timeoutId = window.setTimeout(function () {
        killTask(id, _utils.THREAD_TASK_STATUS.TIMEOUT);
        reject(new TypeError('task timeout'));
      }, options.timeout);
      task.timeoutId = timeoutId;
    }
  }, []); // 初始化worker池

  var initWorkerPool = (0, _react.useCallback)(function () {
    if (poolSize < 1) {
      throw new RangeError('size must greater than 0');
    }

    workerUrlRef.current = (0, _utils.createWorkerBlobUrl)(fn, options.remoteDependencies);
    freeWorkersRef.current = Array.from({
      length: poolSize
    }, function () {
      return new Worker(workerUrlRef.current);
    });
    workerPoolRef.current = new Set(freeWorkersRef.current);
  }, []); // 调用worker执行任务

  var runFn = (0, _react.useCallback)(function () {
    for (var _len = arguments.length, fnArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      fnArgs[_key] = arguments[_key];
    }

    if (workerPoolRef.current.size === 0) {
      initWorkerPool();
    }

    var id = Date.now();
    var promise = new Promise(function (resolve, reject) {
      return startWorker(resolve, reject, fnArgs, id);
    });
    return [promise, id];
  }, []); // 停止worker任务

  var killTask = (0, _react.useCallback)(function (id, status) {
    var task = allTasksRef.current.get(id);

    if (task) {
      if (task.status === _utils.THREAD_TASK_STATUS.RUNNING) {
        onTaskFinish(task.worker);
      } else if (task.status === _utils.THREAD_TASK_STATUS.PENDING) {
        var index = pendingQueueRef.current.findIndex(function (pending) {
          return pending[3] === id;
        });
        pendingQueueRef.current.splice(index, 1);
      }

      if (!status) {
        task.reject(new TypeError('task killed'));
      }

      setTaskStatus(id, status || _utils.THREAD_TASK_STATUS.KILLED);
      window.clearTimeout(task.timeoutId);
    }
  }, []); // 获取任务状态

  var getTaskStatus = (0, _react.useCallback)(function (id) {
    var task = allTasksRef.current.get(id);

    if (task) {
      return task.status;
    }
  }, []); // 获取空闲worker数

  var getFreeCount = (0, _react.useCallback)(function () {
    return freeWorkersRef.current.length;
  }, []); // 获取等待任务数

  var getPendingCount = (0, _react.useCallback)(function () {
    return pendingQueueRef.current.length;
  }, []); // 获取执行任务数

  var getRuningCount = (0, _react.useCallback)(function () {
    return poolSize - getFreeCount();
  }, []); // 清空所有任务和worker

  var clearAll = (0, _react.useCallback)(function () {
    freeWorkersRef.current.forEach(function (w) {
      workerPoolRef.current.delete(w);
      w.terminate();
    });
    freeWorkersRef.current.length = 0;
    pendingQueueRef.current.forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          reject = _ref4[1];

      return reject(new TypeError('workerpool cleared'));
    });
    pendingQueueRef.current.length = 0;
    workerPoolRef.current.forEach(function (w) {
      w.terminate();

      if (w.onerror) {
        w.onerror(new ErrorEvent('error', {
          error: new TypeError('workerpool cleared')
        }));
      }
    });
    workerPoolRef.current.clear();
    URL.revokeObjectURL(workerUrlRef.current);
  }, []);
  (0, _react.useEffect)(function () {
    return clearAll;
  }, []);
  var helper = {
    kill: killTask,
    getStatus: getTaskStatus,
    getFreeCount: getFreeCount,
    getPendingCount: getPendingCount,
    getRuningCount: getRuningCount
  };
  return [runFn, helper];
};

var _default = useThreadPool;
exports.default = _default;
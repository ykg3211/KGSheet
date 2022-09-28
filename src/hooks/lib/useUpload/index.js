"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _utils = require("./utils");

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _empty() {}

function _continueIgnored(value) {
  if (value && value.then) {
    return value.then(_empty);
  }
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

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

var initialState = {
  progress: 0,
  success: false,
  error: null
};

var useUpload = function useUpload(options) {
  var _options$disabled = options.disabled,
      disabled = _options$disabled === void 0 ? false : _options$disabled,
      _options$multiple = options.multiple,
      multiple = _options$multiple === void 0 ? false : _options$multiple,
      accept = options.accept,
      defaultList = options.defaultList,
      uploadRequest = options.uploadRequest,
      beforeUpload = options.beforeUpload;
  var inputRef = (0, _react.useRef)();
  var dropRef = (0, _react.useRef)();
  var disabledRef = (0, _react.useRef)(disabled);

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      uploadList = _useState2[0],
      setUploadList = _useState2[1];

  var _useState3 = (0, _react.useState)(defaultList || []),
      _useState4 = _slicedToArray(_useState3, 2),
      fileList = _useState4[0],
      setFileList = _useState4[1]; // 更新禁用状态


  (0, _react.useEffect)(function () {
    disabledRef.current = disabled;
  }, [disabled]); // 屏蔽默认拖拽行为

  (0, _react.useLayoutEffect)(function () {
    if (dropRef.current) {
      var dropEl = dropRef.current;

      var preventDefault = function preventDefault(e) {
        return e.preventDefault();
      };

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
        dropEl.addEventListener(eventName, preventDefault, false);
        document.body.addEventListener(eventName, preventDefault, false);
      });
      return function () {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
          dropEl.removeEventListener(eventName, preventDefault, false);
          document.body.removeEventListener(eventName, preventDefault, false);
        });
      };
    }
  }, [dropRef]); // 更新上传项状态

  var updateUploadItem = (0, _react.useCallback)(function (key, newState) {
    setUploadList(function (list) {
      return list.map(function (item) {
        return item.key !== key ? item : _objectSpread(_objectSpread({}, item), {}, {
          state: _objectSpread(_objectSpread({}, item.state), newState)
        });
      });
    });
  }, [setUploadList]); // 上传

  var uploadHandler = (0, _react.useCallback)(function (item, fileArr) {
    var key = item.key;
    uploadRequest(item.file, function (progress) {
      updateUploadItem(key, {
        progress: progress
      });
    }, fileArr).then(function (res) {
      if (res.success) {
        updateUploadItem(key, {
          progress: 100,
          success: true
        });
        setFileList(function (list) {
          return [].concat(_toConsumableArray(list), [res.file]);
        });
      } else {
        updateUploadItem(key, {
          success: false,
          error: res.error
        });
      }
    }).catch(function (error) {
      updateUploadItem(key, {
        success: false,
        error: error
      });
    });
  }, []); // 处理files

  var filesHandler = (0, _react.useCallback)(_async(function (files, e) {
    var inputEl = e.target;

    if (disabledRef.current || !files || files.length > 1 && !multiple) {
      if (inputEl) inputEl.value = '';
      return;
    }

    var shouldUpload = true;
    return _invoke(function () {
      if (beforeUpload) {
        e.persist();
        return _continueIgnored(_catch(function () {
          return _await(beforeUpload(files, e), function (_beforeUpload) {
            shouldUpload = _beforeUpload;
          });
        }, function (error) {
          console.error(error);
        }));
      }
    }, function () {
      if (shouldUpload) {
        var fileArr = Array.from(files);

        if (Array.isArray(shouldUpload)) {
          fileArr = shouldUpload;
        }

        var _uploadList = fileArr.map(function (file) {
          return {
            key: (0, _utils.getKey)(),
            file: file,
            state: _objectSpread({}, initialState),
            previewUrl: (0, _utils.getPreviewUrl)(file)
          };
        });

        setUploadList(function (list) {
          return [].concat(_toConsumableArray(list), _toConsumableArray(_uploadList));
        });

        _uploadList.forEach(function (item) {
          uploadHandler(item, fileArr);
        });
      }

      if (inputEl) inputEl.value = '';
    });
  }), [beforeUpload]); // 监听input变更

  var onChange = (0, _react.useCallback)(function (e) {
    var files = e.target.files;
    filesHandler(files, e);
  }, [fileList, filesHandler]); // 监听拖拽

  var onDrop = (0, _react.useCallback)(function (e) {
    if (disabledRef.current) return;
    var files = e.dataTransfer.files;
    filesHandler(files, e);
  }, [filesHandler]); // 触发input上传

  var trigger = (0, _react.useCallback)(function () {
    if (disabledRef.current) return;

    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []); // 重新上传

  var reUpload = (0, _react.useCallback)(function (item) {
    var key = item.key;
    updateUploadItem(key, initialState);
    uploadHandler(item, [item.file]);
  }, []); // 移除下载项

  var removeUploadItem = (0, _react.useCallback)(function (item) {
    var key = item.key;
    setUploadList(function (list) {
      return list.filter(function (item) {
        return item.key !== key;
      });
    });
  }, []); // 移除已下载文件

  var removeFile = (0, _react.useCallback)(function (file) {
    setFileList(function (list) {
      return list.filter(function (f) {
        return f !== file;
      });
    });
  }, []);
  return {
    inputProps: {
      ref: inputRef || {},
      type: 'file',
      style: {
        display: 'none'
      },
      disabled: disabled,
      accept: accept,
      multiple: multiple,
      onChange: onChange
    },
    dropProps: {
      ref: dropRef,
      onDrop: onDrop
    },
    fileList: fileList,
    uploadList: uploadList,
    trigger: trigger,
    download: _utils.download,
    reUpload: reUpload,
    removeUploadItem: removeUploadItem,
    removeFile: removeFile,
    setUploadList: setUploadList,
    setFileList: setFileList
  };
};

var _default = useUpload;
exports.default = _default;
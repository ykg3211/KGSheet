"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeCacheType = exports.setCache = exports.getCache = void 0;

var _baseCache = _interopRequireDefault(require("./baseCache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = new _baseCache.default();

var setCache = function setCache(key, cacheTime, data) {
  var currentCache = cache.getValue(key);

  if (currentCache !== null && currentCache !== void 0 && currentCache.timer) {
    clearTimeout(currentCache.timer);
  }

  var timer = undefined;

  if (cacheTime > -1) {
    // 数据在不活跃 cacheTime 后，删除掉
    timer = setTimeout(function () {
      cache.removeItem(key);
    }, cacheTime);
  }

  var value = {
    data: data,
    timer: timer,
    startTime: new Date().getTime()
  };
  cache.setValue(key, value);
};

exports.setCache = setCache;

var getCache = function getCache(key) {
  var currentCache = cache.getValue(key);
  return {
    data: currentCache === null || currentCache === void 0 ? void 0 : currentCache.data,
    startTime: currentCache === null || currentCache === void 0 ? void 0 : currentCache.startTime
  };
};

exports.getCache = getCache;

var changeCacheType = function changeCacheType(type) {
  cache.changeType(type);
};

exports.changeCacheType = changeCacheType;
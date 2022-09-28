function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import Starling from '@ies/starling_client';
import { useState, useEffect, useMemo } from 'react';
import IntlMessageFormat from 'intl-messageformat';

var getLang = function getLang(localLangKey, defaultLang) {
  // 检测项目是否设置过语言，若没有则用浏览器的语言偏好
  var lang = localStorage.getItem(localLangKey) || navigator && navigator.language || defaultLang || 'zh-cn';
  return lang;
};

var useStarling = function useStarling(starlingConfig) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$localLangKey = options.localLangKey,
      localLangKey = _options$localLangKey === void 0 ? 'useStarlingLang' : _options$localLangKey,
      _options$customTexts = options.customTexts,
      customTexts = _options$customTexts === void 0 ? {} : _options$customTexts,
      _options$fallbackText = options.fallbackTexts,
      fallbackTexts = _options$fallbackText === void 0 ? {} : _options$fallbackText,
      _options$isDev = options.isDev,
      isDev = _options$isDev === void 0 ? false : _options$isDev,
      _options$defaultLang = options.defaultLang,
      defaultLang = _options$defaultLang === void 0 ? 'zh-cn' : _options$defaultLang,
      _options$ifMountToWin = options.ifMountToWindow,
      ifMountToWindow = _options$ifMountToWin === void 0 ? true : _options$ifMountToWin,
      _options$transFnName = options.transFnName,
      transFnName = _options$transFnName === void 0 ? 'trans' : _options$transFnName;

  var _useState = useState(function () {
    return getLang(localLangKey, defaultLang);
  }),
      _useState2 = _slicedToArray(_useState, 2),
      lang = _useState2[0],
      setLang = _useState2[1];

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      starlingTexts = _useState4[0],
      setStarlingTexts = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useState7 = useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      loadTextsError = _useState8[0],
      setLoadTextsError = _useState8[1];

  var texts = useMemo(function () {
    return _objectSpread(_objectSpread(_objectSpread({}, fallbackTexts), starlingTexts), customTexts);
  }, [starlingTexts]); // 防止重复执行

  var trans = useMemo(function () {
    var getTexts = function getTexts(key, format) {
      if (!format) return texts[key];
      return new IntlMessageFormat(texts[key], lang).format(format);
    };

    var devTrans = function devTrans(key, format) {
      return (// 将未翻译文案特殊展示
        getTexts(key, format) || "\u26A0\uFE0F".concat(key, "\u26A0\uFE0F")
      );
    };

    var proTrans = function proTrans(key, format) {
      return (// 中文兜底
        getTexts(key, format) || key
      );
    };

    return isDev ? devTrans : proTrans;
  }, [isDev, texts, lang]);
  useEffect(function () {
    setLoading(true);

    if (typeof lang !== 'string') {
      setLoading(false);
      return;
    }

    localStorage.setItem(localLangKey, lang);
    var starling = new Starling(_objectSpread(_objectSpread({
      // @ts-ignore
      zoneHost: 'https://starling.snssdk.com'
    }, starlingConfig), {}, {
      locale: lang.split('-')[0]
    }));

    try {
      /* eslint-disable no-new */
      new Promise(function (resolve) {
        starling.load(function (texts) {
          setStarlingTexts(texts || {});
          setLoading(false);
          resolve('');
        });
      });
    } catch (error) {
      setLoadTextsError(error);
      setLoading(false);
    }
  }, [lang]); // 将 trans 挂在到全局
  // ifMountToWindow 用户自定义是否需要挂载到全局
  // 检测执行环境，防止服务端没有 window 会挂掉
  // 以 transFnName 来区分不同项目对应的转换函数，防止覆盖

  if (ifMountToWindow && transFnName) {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window[transFnName] = trans;
    } else if (typeof global !== 'undefined') {
      // @ts-ignore
      global[transFnName] = trans;
    }
  }

  return {
    trans: trans,
    texts: texts,
    starlingTexts: starlingTexts,
    loadTextsError: loadTextsError,
    lang: lang,
    setLang: setLang,
    loading: loading,
    setLoading: setLoading
  };
};

export default useStarling;
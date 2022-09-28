function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useState, useLayoutEffect, useRef, useMemo } from 'react';
import useInView from '../useInView';

var useLazyImg = function useLazyImg(src) {
  var srcOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 ? arguments[2] : undefined;
  var imgElRef = useRef();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loadStartState = _useState2[0],
      setLoadStartState = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      loadedState = _useState4[0],
      setLoadedState = _useState4[1];

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      errorState = _useState6[0],
      setErrorState = _useState6[1];

  var _useInView = useInView(function () {
    return imgElRef.current;
  }, options, []),
      _useInView2 = _slicedToArray(_useInView, 2),
      _ = _useInView2[0],
      inView = _useInView2[1];

  var getTrueSrc = function getTrueSrc(src) {
    return typeof src === 'function' ? src() : src;
  }; // 防止DOM重新渲染时已加载图片不显示


  useLayoutEffect(function () {
    var imgEl = imgElRef.current;

    if (loadedState && imgEl) {
      imgEl.src = getTrueSrc(src);
    }
  });
  useLayoutEffect(function () {
    var imgEl = imgElRef.current; // 在可视区内且有图片节点且未开始加载

    if (inView && imgEl && !loadStartState) {
      setLoadStartState(true);

      var handleImgLoad = function handleImgLoad() {
        setLoadedState(true);
      };

      var handleImgError = function handleImgError(error) {
        setErrorState(error);

        if (srcOptions.fallbackSrc) {
          var fallbackSrc = srcOptions.fallbackSrc;
          imgEl.src = getTrueSrc(fallbackSrc);
        }
      };

      if (srcOptions.loadingSrc) {
        var loadingSrc = srcOptions.loadingSrc;
        imgEl.src = getTrueSrc(loadingSrc);
        var temploadImageEl = new Image();

        var _handleImgLoad = function _handleImgLoad() {
          setLoadedState(true);
          imgEl.src = temploadImageEl.src;
        };

        temploadImageEl.addEventListener('load', _handleImgLoad, {
          once: true
        });
        temploadImageEl.addEventListener('error', handleImgError, {
          once: true
        });
        temploadImageEl.src = getTrueSrc(src);
      } else {
        imgEl.addEventListener('load', handleImgLoad, {
          once: true
        });
        imgEl.addEventListener('error', handleImgError, {
          once: true
        });
        imgEl.src = getTrueSrc(src);
      }
    }
  }, [inView]);
  var curSrc = useMemo(function () {
    if (loadedState) {
      return getTrueSrc(src);
    }

    if (errorState) {
      if (srcOptions.fallbackSrc) {
        return getTrueSrc(srcOptions.fallbackSrc);
      }

      return '';
    }

    if (srcOptions.loadingSrc) {
      return getTrueSrc(srcOptions.loadingSrc);
    }

    return '';
  }, [loadStartState, loadedState, errorState]);
  return {
    ref: imgElRef,
    curSrc: curSrc,
    loadStartState: loadStartState,
    loadedState: loadedState,
    errorState: errorState
  };
};

export default useLazyImg;
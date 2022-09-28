/* eslint no-empty: 0 */
import { useLayoutEffect, useRef } from 'react';
import screenfull from 'screenfull';
import useBoolean from '../useBoolean';
export default (function (el, options) {
  var _ref = options || {},
      onExitFull = _ref.onExitFull,
      onFull = _ref.onFull,
      defaultValue = _ref.defaultValue;

  var onExitFullRef = useRef(onExitFull);
  onExitFullRef.current = onExitFull;
  var onFullRef = useRef(onFull);
  onFullRef.current = onFull;
  var element = useRef();

  var _useBoolean = useBoolean(defaultValue),
      state = _useBoolean.state,
      toggle = _useBoolean.toggle,
      setTrue = _useBoolean.setTrue,
      setFalse = _useBoolean.setFalse;

  useLayoutEffect(function () {
    /* 非全屏时，不需要监听任何全屏事件 */
    if (!state) {
      return;
    }

    var passedInElement = typeof el === 'function' ? el() : el;
    var targetElement = passedInElement || element.current;

    if (!targetElement) {
      return;
    }
    /* 监听退出 */


    var onChange = function onChange() {
      if (screenfull.isEnabled) {
        var isFullscreen = screenfull.isFullscreen;
        toggle(isFullscreen);
      }
    };

    if (screenfull.isEnabled) {
      try {
        screenfull.request(targetElement);
        setTrue();

        if (onFullRef.current) {
          onFullRef.current();
        }
      } catch (error) {
        setFalse();

        if (onExitFullRef.current) {
          onExitFullRef.current();
        }
      }

      screenfull.on('change', onChange);
    }
    /* state 从 true 变为 false，则关闭全屏 */


    return function () {
      if (screenfull.isEnabled) {
        try {
          screenfull.off('change', onChange);
          screenfull.exit();
        } catch (error) {}
      }

      if (onExitFullRef.current) {
        onExitFullRef.current();
      }
    };
  }, [state, typeof el === 'function' ? undefined : el]);

  var toggleFull = function toggleFull() {
    return toggle();
  };

  var result = {
    isFullscreen: !!state,
    setFull: setTrue,
    exitFull: setFalse,
    toggleFull: toggleFull
  };

  if (!el) {
    result.ref = element;
  }

  return result;
});
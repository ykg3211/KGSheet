import { useEffect, useRef, useLayoutEffect } from 'react';

function useAddEventListener(target, type, listener, options) {
  var listenerRef = useRef(listener);
  useEffect(function () {
    listenerRef.current = listener;
  }, [listener]);
  useLayoutEffect(function () {
    var targetEl = typeof target === 'function' ? target() : target;
    if (!targetEl) return;

    var eventListener = function eventListener(e) {
      return listenerRef.current(e);
    };

    targetEl.addEventListener(type, eventListener, {
      capture: options === null || options === void 0 ? void 0 : options.capture,
      once: options === null || options === void 0 ? void 0 : options.once,
      passive: options === null || options === void 0 ? void 0 : options.passive
    });
    return function () {
      targetEl.removeEventListener(type, eventListener, {
        capture: options === null || options === void 0 ? void 0 : options.capture
      });
    };
  }, [target, type, options]);
}

export default function useEventListener(eventName, eventListener, options) {
  var ref = useRef();

  var eventTarget = (options === null || options === void 0 ? void 0 : options.target) || function () {
    return ref.current || window;
  };

  useAddEventListener(eventTarget, eventName, eventListener, options);
  return ref;
}
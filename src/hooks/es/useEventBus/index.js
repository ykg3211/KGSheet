import { useEffect, useRef } from 'react';
import usePersistCallback from '../usePersistCallback';
import { mitt } from './mitt';
export var emitter = mitt();
export default function useEventBus(eventName, callback) {
  var on = emitter.on,
      off = emitter.off,
      emit = emitter.emit;
  var subscribed = useRef(false);
  var cb = usePersistCallback(function () {
    if (callback) {
      callback.apply(void 0, arguments);
    }
  });
  var trigger = usePersistCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    emit.apply(void 0, [eventName].concat(args));
  });
  var subscribe = usePersistCallback(function () {
    if (!subscribed.current) {
      on(eventName, cb);
      subscribed.current = true;
    }
  });
  var unsubscribe = usePersistCallback(function () {
    off(eventName, cb);
    subscribed.current = false;
  });
  useEffect(function () {
    subscribe();
    return function () {
      unsubscribe();
    };
  }, []);

  if (callback) {
    return {
      trigger: trigger,
      unsubscribe: unsubscribe,
      subscribe: subscribe
    };
  }

  return {
    trigger: trigger
  };
}
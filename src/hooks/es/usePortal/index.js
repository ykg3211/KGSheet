import useForceUpdate from '../useForceUpdate';
import { useRef, useMemo, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import useBoolean from '../useBoolean';
import useScrollLock from '../useScrollLock';

var usePortal = function usePortal() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var el = options.el,
      scrollLock = options.scrollLock,
      escClose = options.escClose,
      defaultState = options.default;
  var ref = useRef();

  var _useBoolean = useBoolean(defaultState),
      state = _useBoolean.state,
      toggle = _useBoolean.toggle,
      setTrue = _useBoolean.setTrue,
      setFalse = _useBoolean.setFalse;

  var forceUpdate = useForceUpdate();

  var _useScrollLock = useScrollLock(),
      lock = _useScrollLock.lock,
      unlock = _useScrollLock.unlock;

  var Portal = useMemo(function () {
    return function (_ref) {
      var children = _ref.children;

      if (state) {
        var target = ref.current || document.body;

        if (el) {
          target = typeof el === 'function' ? el() : el;
        }

        if (target) {
          return /*#__PURE__*/ReactDOM.createPortal(children, target);
        }
      }

      return null;
    };
  }, [state, ref.current, typeof el === 'function' ? undefined : el]);
  useLayoutEffect(function () {
    forceUpdate();
  }, [ref.current, typeof el === 'function' ? undefined : el]);
  useLayoutEffect(function () {
    state && scrollLock ? lock() : unlock();
  }, [state, scrollLock]);
  useLayoutEffect(function () {
    if (!state || !escClose) return;

    var handleKeyDown = function handleKeyDown(e) {
      if (e.keyCode === 27) setFalse();
    };

    document.addEventListener('keydown', handleKeyDown);
    return function () {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, escClose]);
  return {
    Portal: Portal,
    isOpen: state,
    open: setTrue,
    close: setFalse,
    toggle: toggle,
    ref: ref
  };
};

export default usePortal;
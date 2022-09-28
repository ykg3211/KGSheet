import { useRef, useCallback } from 'react';

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

function useLockFn(fn) {
  var lockRef = useRef(false);
  return useCallback(_async(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (lockRef.current) {
      return;
    }

    lockRef.current = true;
    return _catch(function () {
      return _await(fn.apply(void 0, args), function (res) {
        lockRef.current = false;
        return res;
      });
    }, function (e) {
      lockRef.current = false;
      throw e;
    });
  }), [fn]);
}

export default useLockFn;
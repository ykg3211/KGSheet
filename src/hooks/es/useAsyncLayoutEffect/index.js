import { useLayoutEffect } from 'react';

var useAsyncLayoutEffect = function useAsyncLayoutEffect(asyncCallback, deps) {
  useLayoutEffect(function () {
    var promiseResult = asyncCallback();
    return function () {
      promiseResult.then(function (cleanup) {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, deps);
};

export default useAsyncLayoutEffect;
import { useEffect } from 'react';

var useAsyncEffect = function useAsyncEffect(asyncCallback, deps) {
  useEffect(function () {
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

export default useAsyncEffect;
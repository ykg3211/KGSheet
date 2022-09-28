import { useEffect, useRef } from 'react';

var useUpdateEffect = function useUpdateEffect(effect, deps) {
  var isMounted = useRef(false);
  useEffect(function () {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }

    return function () {};
  }, deps);
};

export default useUpdateEffect;
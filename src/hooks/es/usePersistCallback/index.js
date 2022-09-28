import { useRef, useCallback } from 'react';

function usePersistCallback(fn) {
  var ref = useRef();
  ref.current = fn;
  return useCallback( // @ts-ignore
  function () {
    var fn = ref.current;
    return fn && fn.apply(void 0, arguments);
  }, [ref]);
}

export default usePersistCallback;
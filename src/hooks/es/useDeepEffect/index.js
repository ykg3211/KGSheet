import { useEffect } from 'react';
import useDeepMemo from '../useDeepMemo';
export function useDeepEffect() {
  var callback = arguments[0];
  var isEqual = arguments[1];
  var deps = arguments[2];

  if (arguments.length === 2) {
    deps = isEqual;
    isEqual = undefined;
  }

  var memoizedDeps = useDeepMemo(deps, isEqual);
  useEffect(function () {
    callback();
  }, [memoizedDeps]);
}
export default useDeepEffect;
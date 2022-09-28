import { useCallback, useMemo, useRef } from 'react';
import useForceUpdate from '../useForceUpdate';
import usePrevious from '../usePrevious';
import isEqual from 'lodash.isequal';
export var useResetState = function useResetState(init, autoReset, deps) {
  var preDeps = usePrevious(deps);
  var initState = useMemo(init, deps);
  var stateRef = useRef(initState);

  if (!isEqual(deps, preDeps) && autoReset) {
    stateRef.current = initState;
  }

  var forceUpdate = useForceUpdate();
  var setState = useCallback(function (action) {
    var newS;

    if (typeof action === 'function') {
      var f = action;
      newS = f(stateRef.current);
    } else {
      newS = action;
    }

    if (!isEqual(newS, stateRef.current)) {
      stateRef.current = newS;
      forceUpdate();
    }
  }, []);
  var reset = useCallback(function () {
    stateRef.current = initState;
    forceUpdate();
  }, [initState]);
  return [stateRef.current, setState, reset];
};
export default useResetState;
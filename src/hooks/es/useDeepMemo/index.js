import defaultIsEqual from 'lodash.isequal';
import { useEffect, useRef } from 'react';

var useDeepMemo = function useDeepMemo(value) {
  var isEqual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultIsEqual;
  var cacheValue = useRef(value);
  var isSame = isEqual(cacheValue.current, value);
  useEffect(function () {
    if (!isSame) {
      cacheValue.current = value;
    }
  });
  return isSame ? cacheValue.current : value;
};

export default useDeepMemo;
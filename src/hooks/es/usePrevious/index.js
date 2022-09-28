import { useEffect, useRef } from 'react';

var usePrevious = function usePrevious(state) {
  var ref = useRef();
  useEffect(function () {
    ref.current = state;
  });
  return ref.current;
};

export default usePrevious;
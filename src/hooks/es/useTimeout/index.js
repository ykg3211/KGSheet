import { useRef, useEffect } from 'react';

var useTimeout = function useTimeout(fn, delay) {
  var savedFn = useRef(fn);
  useEffect(function () {
    savedFn.current = fn;
  }, [fn]);
  useEffect(function () {
    if (typeof delay !== 'number') return;
    var id = setTimeout(function () {
      return savedFn.current();
    }, delay);
    return function () {
      return clearTimeout(id);
    };
  }, [delay]);
};

export default useTimeout;
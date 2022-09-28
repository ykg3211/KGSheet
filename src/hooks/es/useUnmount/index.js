import { useEffect, useRef } from 'react';
export default (function (fn) {
  var fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(function () {
    return function () {
      return fnRef.current();
    };
  }, []);
});
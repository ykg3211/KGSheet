import { useLayoutEffect, useRef } from 'react';

function syncScroll(target, followers, direction, measure) {
  var percentage = // @ts-ignore
  target["scroll".concat(direction)] / ( // @ts-ignore
  target["scroll".concat(measure)] - target["offset".concat(measure)]);
  window.requestAnimationFrame(function () {
    followers.forEach(function (el) {
      // @ts-ignore
      el["scroll".concat(direction)] = Math.round( // @ts-ignore
      percentage * (el["scroll".concat(measure)] - el["offset".concat(measure)]));
    });
  });
}

var useSyncScroll = function useSyncScroll(refs) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    vertical: true,
    horizontal: true
  };
  // record the number of follow scrolling elements to prevent scrolling indefinitely
  var followerCountRef = useRef(0);
  var vertical = options.vertical,
      horizontal = options.horizontal;
  useLayoutEffect(function () {
    if (refs.length < 2) return;

    function handleScroll(ev) {
      var target = ev.target;

      if (followerCountRef.current > 0) {
        followerCountRef.current -= 1;
        return;
      }

      var followers = refs.filter(function (ref) {
        return ref.current !== target;
      }).map(function (ref) {
        return ref.current;
      });
      followerCountRef.current = followers.length;
      if (vertical) syncScroll(target, followers, 'Top', 'Height');
      if (horizontal) syncScroll(target, followers, 'Left', 'Width');
    }

    refs.forEach(function (ref) {
      return ref.current && ref.current.addEventListener('scroll', handleScroll);
    });
    return function () {
      refs.forEach(function (ref) {
        return ref.current && ref.current.removeEventListener('scroll', handleScroll);
      });
    };
  }, [refs.length, vertical, horizontal]);
};

export default useSyncScroll;
import { useRef, useEffect, useCallback } from 'react'; // 鼠标点击事件，click 不会监听右键

var defaultEvent = 'click';
export default function useClickOutside() {
  var dom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var onClickAway = arguments.length > 1 ? arguments[1] : undefined;
  var eventName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultEvent;
  var element = useRef();
  var handler = useCallback(function (event) {
    var targetElement = typeof dom === 'function' ? dom() : dom;
    var el = targetElement || element.current; // https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
    // 1. 包裹元素包含点击元素
    // 2. 点击元素曾在包裹元素内

    if (!el || el.contains(event.target) || event.composedPath && event.composedPath().includes(el)) {
      return;
    }

    onClickAway(event);
  }, [element.current, onClickAway, dom]);
  useEffect(function () {
    document.addEventListener(eventName, handler);
    return function () {
      document.removeEventListener(eventName, handler);
    };
  }, [eventName, handler]);
  return element;
}
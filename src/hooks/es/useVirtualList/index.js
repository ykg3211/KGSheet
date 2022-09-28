function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useEffect, useState, useMemo } from 'react';
import useSize from '../useSize';
export default (function (originalList, options) {
  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var itemHeight = options.itemHeight,
      _options$overscan = options.overscan,
      overscan = _options$overscan === void 0 ? 5 : _options$overscan,
      _onScroll = options.onScroll;

  var _useSize = useSize(),
      _useSize2 = _slicedToArray(_useSize, 2),
      scrollerRef = _useSize2[0],
      size = _useSize2[1];

  var _useState = useState({
    start: 0,
    end: 10
  }),
      _useState2 = _slicedToArray(_useState, 2),
      range = _useState2[0],
      setRange = _useState2[1];

  if (!itemHeight) {
    console.warn('please enter a valid itemHeight');
  } // 滚动容器宽高变化时重新计算渲染范围


  useEffect(function () {
    getListRange();
  }, [size.width, size.height, originalList.length]); // 内容容器总高度

  var totalHeight = useMemo(function () {
    if (typeof itemHeight === 'number') {
      return originalList.length * itemHeight;
    }

    return originalList.reduce(function (sum, data, index) {
      return sum + itemHeight(data, index);
    }, 0);
  }, [originalList.length].concat(_toConsumableArray(deps))); // 当前渲染的数据列表

  var list = useMemo(function () {
    return originalList.slice(range.start, range.end).map(function (ele, index) {
      return {
        data: ele,
        index: index + range.start
      };
    });
  }, [originalList, range]); // 计算渲染数据范围（可视区数量+上下预留数量）

  var getListRange = function getListRange() {
    var element = scrollerRef.current;

    if (element) {
      var offset = getRangeOffset(element.scrollTop);
      var viewCapacity = getViewCapacity(element.clientHeight);
      var from = offset - overscan;
      var to = offset + viewCapacity + overscan;
      setRange({
        start: from < 0 ? 0 : from,
        end: to > originalList.length ? originalList.length : to
      });
    }
  }; // 计算可视区元素数量


  var getViewCapacity = function getViewCapacity(scrollerHeight) {
    if (typeof itemHeight === 'number') {
      return Math.ceil(scrollerHeight / itemHeight);
    }

    var _range$start = range.start,
        start = _range$start === void 0 ? 0 : _range$start;
    var sum = 0;
    var capacity = 0;

    for (var i = start; i < originalList.length; i++) {
      var height = itemHeight(originalList[i], i);
      sum += height;

      if (sum >= scrollerHeight) {
        capacity = i;
        break;
      }
    }

    return capacity - start;
  }; // 根据滚动容器 scrollTop 计算可视区数据起始索引


  var getRangeOffset = function getRangeOffset(scrollTop) {
    if (typeof itemHeight === 'number') {
      return Math.floor(scrollTop / itemHeight) + 1;
    }

    var sum = 0;
    var offset = 0;

    for (var i = 0; i < originalList.length; i++) {
      var height = itemHeight(originalList[i], i);
      sum += height;

      if (sum >= scrollTop) {
        offset = i;
        break;
      }
    }

    return offset + 1;
  }; // 计算上方偏移高度


  var getDistanceTop = function getDistanceTop(index) {
    if (typeof itemHeight === 'number') {
      var _height = index * itemHeight;

      return _height;
    }

    var height = originalList.slice(0, index).reduce(function (sum, data, index) {
      return sum + itemHeight(data, index);
    }, 0);
    return height;
  }; // 滚动到指定索引元素


  var scrollTo = function scrollTo(index) {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = getDistanceTop(index);
      getListRange();
    }
  };

  return {
    list: list,
    scrollTo: scrollTo,
    scrollerRef: scrollerRef,
    scrollerProps: {
      ref: scrollerRef,
      onScroll: function onScroll(e) {
        e.preventDefault();
        getListRange();
        if (_onScroll) _onScroll(e);
      },
      style: {
        overflowY: 'auto'
      }
    },
    wrapperProps: {
      style: {
        width: '100%',
        height: totalHeight,
        paddingTop: getDistanceTop(range.start)
      }
    }
  };
});
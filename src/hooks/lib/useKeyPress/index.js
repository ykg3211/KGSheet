"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchCombo = matchCombo;
exports.default = void 0;

var _react = require("react");

var _lodash = _interopRequireDefault(require("lodash.zip"));

var _lodash2 = _interopRequireDefault(require("lodash.xor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isPermutation(a, b) {
  return (0, _lodash2.default)(a, b).length === 0;
}

function contains(superset, subset) {
  var set = new Set(superset);
  return subset.every(function (item) {
    return set.has(item);
  });
}

var noop = function noop() {}; // 键盘事件 keyCode 别名


var aliasKeyCodeMap = {
  esc: [27],
  tab: [9],
  enter: [13],
  space: [32],
  up: [38],
  left: [37],
  right: [39],
  down: [40],
  delete: [8, 46]
}; // 键盘事件 key 别名

var aliasKeyMap = {
  esc: ['Escape'],
  tab: ['Tab'],
  enter: ['Enter'],
  space: [' '],
  // IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  delete: ['Backspace', 'Delete']
};
var modifierAliases = ['alt', 'ctrl', 'meta', 'shift'];
var modifiers = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'];
var modifierMap = new Map((0, _lodash.default)(modifierAliases, modifiers));

var isModifierAlias = function isModifierAlias(key) {
  return modifierAliases.includes(key);
};

var isModified = function isModified(event) {
  return modifiers.some(function (key) {
    return event[key];
  });
};

var getModifiers = function getModifiers(event) {
  return modifiers.filter(function (key) {
    return event[key];
  });
};

function matchKey(event, key) {
  var aliasKey = aliasKeyMap[key];
  var aliasKeyCode = aliasKeyCodeMap[key];
  return aliasKey && aliasKey.includes(event.key) || aliasKeyCode && aliasKeyCode.includes(event.keyCode) || event.key.toUpperCase() === key.toUpperCase();
}
/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent] 真实事件
 * @param [keyFilter: any] 描述
 * @returns Boolean
 */


function matchCombo(event, keyFilter) {
  var exact = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (typeof keyFilter === 'number') {
    return event.keyCode === keyFilter && (!exact || !isModified(event));
  }

  var comboItems = keyFilter.split('.');
  var specificKey = comboItems[comboItems.length - 1];
  var comboModifiers = comboItems.filter(isModifierAlias).map(function (alias) {
    return modifierMap.get(alias);
  });
  var eventModifiers = getModifiers(event);
  var matchModifiers = exact ? isPermutation : contains;
  return matchKey(event, specificKey) && matchModifiers(eventModifiers, comboModifiers);
}
/**
 * 键盘输入预处理方法
 * @param [keyFilter: any] 当前键
 * @returns () => Boolean
 */


function genKeyFormatter(keyFilter) {
  var exact = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var type = _typeof(keyFilter);

  if (type === 'function') {
    return keyFilter;
  }

  if (type === 'string' || type === 'number') {
    return function (event) {
      return matchCombo(event, keyFilter, exact);
    };
  }

  if (Array.isArray(keyFilter)) {
    return function (event) {
      return keyFilter.some(function (item) {
        return matchCombo(event, item, exact);
      });
    };
  }

  return keyFilter ? function () {
    return true;
  } : function () {
    return false;
  };
}

var defaultEvents = ['keydown'];

function useKeyPress(keyFilter) {
  var eventHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _option$events = option.events,
      events = _option$events === void 0 ? defaultEvents : _option$events,
      target = option.target,
      _option$exact = option.exact,
      exact = _option$exact === void 0 ? false : _option$exact;
  var element = (0, _react.useRef)();
  var callbackRef = (0, _react.useRef)(eventHandler);
  callbackRef.current = eventHandler;
  var callbackHandler = (0, _react.useCallback)(function (event) {
    var genGuard = genKeyFormatter(keyFilter, exact);

    if (genGuard(event)) {
      return callbackRef.current(event);
    }
  }, [keyFilter]);
  (0, _react.useEffect)(function () {
    var targetElement = typeof target === 'function' ? target() : target;
    var el = element.current || targetElement || window;

    var _iterator = _createForOfIteratorHelper(events),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var eventName = _step.value;
        el.addEventListener(eventName, callbackHandler);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return function () {
      var _iterator2 = _createForOfIteratorHelper(events),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var eventName = _step2.value;
          el.removeEventListener(eventName, callbackHandler);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };
  }, [events, callbackHandler, target]);
  return element;
}

var _default = useKeyPress;
exports.default = _default;
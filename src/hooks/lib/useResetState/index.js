"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.useResetState = void 0;

var _react = require("react");

var _useForceUpdate = _interopRequireDefault(require("../useForceUpdate"));

var _usePrevious = _interopRequireDefault(require("../usePrevious"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useResetState = function useResetState(init, autoReset, deps) {
  var preDeps = (0, _usePrevious.default)(deps);
  var initState = (0, _react.useMemo)(init, deps);
  var stateRef = (0, _react.useRef)(initState);

  if (!(0, _lodash.default)(deps, preDeps) && autoReset) {
    stateRef.current = initState;
  }

  var forceUpdate = (0, _useForceUpdate.default)();
  var setState = (0, _react.useCallback)(function (action) {
    var newS;

    if (typeof action === 'function') {
      var f = action;
      newS = f(stateRef.current);
    } else {
      newS = action;
    }

    if (!(0, _lodash.default)(newS, stateRef.current)) {
      stateRef.current = newS;
      forceUpdate();
    }
  }, []);
  var reset = (0, _react.useCallback)(function () {
    stateRef.current = initState;
    forceUpdate();
  }, [initState]);
  return [stateRef.current, setState, reset];
};

exports.useResetState = useResetState;
var _default = useResetState;
exports.default = _default;
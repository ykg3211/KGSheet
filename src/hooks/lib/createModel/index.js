"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createModel;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// copy for https://github.com/jamiebuilds/unstated-next/blob/master/src/unstated-next.tsx
var EMPTY = Symbol();

function createModel(useHook) {
  var HooksContext = /*#__PURE__*/_react.default.createContext(EMPTY);

  function Provider(props) {
    var value = useHook(props.initialState);
    return /*#__PURE__*/_react.default.createElement(HooksContext.Provider, {
      value: value
    }, props.children);
  }

  function useContext() {
    var value = _react.default.useContext(HooksContext);

    if (value === EMPTY) {
      throw new Error("Component must be wrapped with <Model.Provider>");
    }

    return value;
  }

  return {
    Provider: Provider,
    useContext: useContext
  };
}
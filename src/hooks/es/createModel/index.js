import React from "react"; // copy for https://github.com/jamiebuilds/unstated-next/blob/master/src/unstated-next.tsx

var EMPTY = Symbol();
export default function createModel(useHook) {
  var HooksContext = /*#__PURE__*/React.createContext(EMPTY);

  function Provider(props) {
    var value = useHook(props.initialState);
    return /*#__PURE__*/React.createElement(HooksContext.Provider, {
      value: value
    }, props.children);
  }

  function useContext() {
    var value = React.useContext(HooksContext);

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
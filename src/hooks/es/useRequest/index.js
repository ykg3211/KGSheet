function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useContext } from 'react';
import useBaseRequest from './useBaseRequest';
import useLoadMore from './useLoadMore';
import usePagination from './usePagination';
import useSearch from './useSearch';
import { Mode } from './mode';
export { Mode };
var ConfigContext = /*#__PURE__*/React.createContext({});
ConfigContext.displayName = 'UseRequestConfigContext';

function useRequest(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var contextConfig = useContext(ConfigContext);

  var finalOptions = _objectSpread(_objectSpread({}, contextConfig), options);

  var mode = finalOptions.mode;

  if (mode === Mode.loadMore) {
    return useLoadMore(requestFn, finalOptions);
  }

  if (mode === Mode.pagination) {
    return usePagination(requestFn, finalOptions);
  }

  if (mode === Mode.search) {
    return useSearch(requestFn, finalOptions);
  }

  return useBaseRequest(requestFn, finalOptions);
}

var UseRequestProvider = ConfigContext.Provider;
export { UseRequestProvider };
export default useRequest;
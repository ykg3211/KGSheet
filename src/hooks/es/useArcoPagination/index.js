function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import usePagination from '../usePagination';

function transformFn(returnValue) {
  return _objectSpread(_objectSpread({}, returnValue), {}, {
    pagination: _objectSpread({}, returnValue.pagination),
    // @ts-ignore
    tableProps: _objectSpread(_objectSpread({}, returnValue.tableProps), {}, {
      onChange: function onChange(pagination, sorter, filters) {
        returnValue.tableProps.onChange(pagination, filters, sorter);
      },
      data: returnValue.tableProps.dataSource
    })
  });
}

function useArcoPagination(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var returnValue = usePagination(requestFn, options);
  return transformFn(returnValue);
}

export default useArcoPagination;
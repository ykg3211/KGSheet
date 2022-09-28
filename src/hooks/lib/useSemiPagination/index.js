"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _usePagination = _interopRequireDefault(require("../usePagination"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function transformFn(returnValue) {
  return _objectSpread(_objectSpread({}, returnValue), {}, {
    filters: Object.keys(returnValue.filters).length === 0 ? [] : returnValue.filters,
    pagination: _objectSpread(_objectSpread({}, _objectSpread(_objectSpread({}, returnValue.pagination), {}, {
      // onPageChange: returnValue.pagination.changeCurrent,
      // onPageSizeChange: returnValue.pagination.changePageSize,
      currentPage: returnValue.pagination.current
    })), {}, {
      onPageSizeChange: returnValue.pagination.changePageSize
    }),
    // @ts-ignore
    tableProps: _objectSpread(_objectSpread({}, returnValue.tableProps), {}, {
      pagination: _objectSpread(_objectSpread({}, returnValue.pagination), {}, {
        currentPage: returnValue.pagination.current
      }),
      onChange: function onChange(params) {
        returnValue.tableProps.onChange(_objectSpread({}, _objectSpread(_objectSpread({}, params.pagination), {}, {
          current: params.pagination.currentPage,
          defaultCurrent: params.pagination.defaultCurrentPage
        })), params.filters, params.sorter);
      }
    })
  });
}

function useSemiPagination(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var returnValue = (0, _usePagination.default)(requestFn, options);
  return transformFn(returnValue);
}

var _default = useSemiPagination;
exports.default = _default;
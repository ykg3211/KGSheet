import usePagination from '../usePagination';

function useAntdPagination(requestFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return usePagination(requestFn, options);
}

export default useAntdPagination;
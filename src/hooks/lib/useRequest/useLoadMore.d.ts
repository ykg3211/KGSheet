import type { LoadMoreData, LoadMoreParams, LoadMoreRequestFnType, LoadMoreReturnValue, LoadMoreOptions, LoadMoreItemType } from './types';
export type { LoadMoreData, LoadMoreParams, LoadMoreRequestFnType, LoadMoreReturnValue, LoadMoreOptions, LoadMoreItemType, };
declare function useLoadMore<D extends LoadMoreData>(requestFn: LoadMoreRequestFnType<D>, options?: LoadMoreOptions<D>): LoadMoreReturnValue<D>;
export default useLoadMore;

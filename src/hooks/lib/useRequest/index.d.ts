import React from 'react';
import type { BaseRequestFnType, BaseReturnValue, BaseOptions, LoadMoreData, LoadMoreRequestFnType, LoadMoreReturnValue, LoadMoreOptions as LoadMoreOptionsInner, PaginationData, PaginationRequestFnType, PaginationReturnValue, PaginationOptions as PaginationOptionsInner, SearchRequestFnType, SearchReturnValue, SearchOptions as SearchOptionsInner } from './types';
import { Mode } from './mode';
declare type RequestFnType<D, P extends any[]> = BaseRequestFnType<D, P>;
interface Options<D, P extends any[]> extends BaseOptions<D, P> {
}
interface ReturnValue<D, P extends any[]> extends BaseReturnValue<D, P> {
}
interface LoadMoreOptions<D extends LoadMoreData> extends LoadMoreOptionsInner<D> {
    mode: Mode.loadMore;
}
interface PaginationOptions<D extends PaginationData> extends PaginationOptionsInner<D> {
    mode: Mode.pagination;
}
interface SearchOptions<D, V> extends SearchOptionsInner<D, V> {
    mode: Mode.search;
}
export type { RequestFnType, ReturnValue, Options, LoadMoreData, LoadMoreRequestFnType, LoadMoreReturnValue, LoadMoreOptions, PaginationData, PaginationRequestFnType, PaginationReturnValue, PaginationOptions, SearchRequestFnType, SearchReturnValue, SearchOptions, };
export { Mode };
declare type Config = Options<any, any> | LoadMoreOptions<any> | PaginationOptions<any> | SearchOptions<any, any>;
declare function useRequest<D extends LoadMoreData>(requestFn: LoadMoreRequestFnType<D>, options: LoadMoreOptions<D>): LoadMoreReturnValue<D>;
declare function useRequest<D extends PaginationData>(requestFn: PaginationRequestFnType<D>, options: PaginationOptions<D>): PaginationReturnValue<D>;
declare function useRequest<D, V = string>(requestFn: SearchRequestFnType<D, V>, options: SearchOptions<D, V>): SearchReturnValue<D, V>;
declare function useRequest<D, P extends any[]>(requestFn: RequestFnType<D, P>, options?: Options<D, P>): ReturnValue<D, P>;
declare const UseRequestProvider: React.Provider<Config>;
export { UseRequestProvider };
export default useRequest;

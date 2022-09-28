import { DependencyList, RefObject } from 'react';
import { CachedKeyType, CacheStoreType } from './baseCache';
import { Sorter, Filter, PaginationConfig } from './antdTypes';
export declare type Dispatch<A> = (value: A) => void;
export declare type ChangeDataFn<S> = (prevData: S | undefined) => S | undefined;
export declare type ChangeData<S> = S | ChangeDataFn<S> | undefined;
export declare type RequestsStateType<D, P extends any[]> = {
    data: D | undefined;
    loading: boolean;
    error: Error | undefined;
    params: P;
    isPolling: boolean;
    run: BaseRequestFnType<D, P>;
    cancel: () => void;
    unmount: () => void;
    refresh: () => Promise<D>;
    refreshOptions: (options: Partial<BaseOptions<D, P>>) => Promise<D>;
    changeData: Dispatch<ChangeData<D>>;
};
export interface RequestsType<D, P extends any[]> {
    [key: string]: RequestsStateType<D, P>;
}
export declare type BaseRequestFnType<D, P extends any[]> = (...args: P) => Promise<D>;
declare type DefaultParams<P extends any[]> = {
    [T in keyof P]: Partial<P[T]> | undefined;
};
export interface BaseOptions<D, P extends any[]> {
    auto?: boolean;
    defaultParams?: DefaultParams<P>;
    initData?: D;
    debounceInterval?: number;
    throttleInterval?: number;
    pollingInterval?: number;
    loadingCheck?: boolean;
    errorCheck?: boolean;
    throwOnError?: boolean;
    refreshDeps?: DependencyList;
    ready?: boolean;
    cacheKey?: CachedKeyType;
    cacheTime?: number;
    staleTime?: number;
    cacheStoreType?: CacheStoreType;
    requestKey?: (...params: P) => string;
    formatResult?: (res: D | undefined) => D;
    onSuccess?: (resonse: D, params: P, cancelPolling: () => void) => void;
    onError?: (error: Error, params: P, cancelPolling: () => void) => void;
}
export interface BaseReturnValue<D, P extends any[]> extends RequestsStateType<D, P> {
    reset: () => void;
    requests: RequestsType<D, P>;
}
export declare enum Mode {
    loadMore = "loadMore",
    pagination = "pagination",
    search = "search"
}
/** 下拉加载 */
export interface LoadMoreData {
    list: any[];
    total?: number;
    [key: string]: any;
}
export declare type LoadMoreItemType<D> = D extends {
    list: (infer P)[];
    total?: number;
    [key: string]: any;
} ? P : D;
export declare type LoadMoreParams<D extends LoadMoreData> = {
    data?: D;
    current: number;
    pageSize: number;
    offset: number;
    id?: any;
    startTime: number;
};
export declare type LoadMoreRequestFnType<D extends LoadMoreData> = (...params: [LoadMoreParams<D>, ...any[]]) => Promise<D>;
export interface LoadMoreOptions<D extends LoadMoreData> extends Omit<BaseOptions<D, [LoadMoreParams<D>, ...any[]]>, 'mode'> {
    resetDeps?: DependencyList;
    initPageSize?: number;
    incrementSize?: number;
    ref?: RefObject<HTMLElement>;
    threshold?: number;
    isNoMore?: (r: D, error: Error | undefined, dataGroup: D & {
        list: LoadMoreItemType<D>[];
    }) => boolean;
    noMoreHandler?: (r: D, error: Error | undefined, dataGroup: D & {
        list: LoadMoreItemType<D>[];
    }) => boolean;
    hasMoreHanlder?: (r: D, error: Error | undefined, dataGroup: D & {
        list: LoadMoreItemType<D>[];
    }) => boolean;
    hasMoreHandler?: (r: D, error: Error | undefined, dataGroup: D & {
        list: LoadMoreItemType<D>[];
    }) => boolean;
    itemKey?: string | ((item: LoadMoreItemType<D>, index: number) => string);
}
export interface LoadMoreReturnValue<D extends LoadMoreData> extends Omit<BaseReturnValue<D, [LoadMoreParams<D>, ...any[]]>, "refreshOptions" | "requests"> {
    current: number;
    loading: boolean;
    loadingMore: boolean;
    noMore: boolean;
    hasMore: boolean;
    reload: (showData?: boolean) => void;
    loadMore: (customObj?: Object) => void;
}
/**  分页 */
export interface PaginationData<I extends any = any> {
    list: I[];
    total: number;
    [key: string]: any;
}
export declare type PaginationItemType<D> = D extends {
    list: (infer P)[];
    total: number;
    [key: string]: any;
} ? P : D;
export declare type PaginationParams<D extends PaginationData> = {
    data?: D;
    current: number;
    pageSize: number;
    sorter?: Sorter;
    filters?: Filter;
    [key: string]: any;
};
export declare type PaginationRequestFnType<D extends PaginationData> = (...params: [PaginationParams<D>, ...any[]]) => Promise<D>;
export interface PaginationOptions<D extends PaginationData> extends Omit<BaseOptions<D, [PaginationParams<D>, ...any[]]>, 'mode'> {
    resetFirst?: boolean;
    resetDeps?: DependencyList;
    defaultPageSize?: number;
    initCurrent?: number;
    pageSize?: number;
    current?: number;
}
export interface PaginationReturnValue<D extends PaginationData> extends BaseReturnValue<D, [PaginationParams<D>, ...any[]]> {
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        totalPage: number;
        onChange: (current: number, pageSize: number) => void;
        changeCurrent: (current: number) => void;
        changePageSize: (pageSize: number) => void;
        [key: string]: any;
    };
    tableProps: {
        dataSource: PaginationItemType<D>[];
        loading: boolean;
        onChange: (pagination: PaginationConfig, filters?: Filter, sorter?: Sorter) => void;
        pagination: PaginationConfig;
        [key: string]: any;
    };
    sorter?: Sorter;
    filters?: Filter;
}
/** 搜索 */
export declare type SearchRequestFnType<D, V = string> = (value: V) => Promise<D>;
export interface SearchOptions<D, V = string> extends Omit<BaseOptions<D, [V]>, 'mode'> {
    defaultValue?: V;
}
export interface SearchReturnValue<D, V = string> extends BaseReturnValue<D, [V]> {
    value: V;
    onChange: (value: any) => void;
    cancel: () => void;
}
export {};

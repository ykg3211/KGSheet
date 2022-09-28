import { SorterResult } from 'antd/es/table/interface';
import { BaseReturnValue } from '../useRequest/types';
import { PaginationConfig } from '../useRequest/antdTypes';
import type { PaginationData, PaginationOptions, PaginationItemType } from '../usePagination';
export type { PaginationData, PaginationOptions, PaginationItemType };
export declare type PaginationParams<D extends PaginationData> = {
    data?: D;
    current: number;
    pageSize: number;
    sorter?: SorterResult<any>;
    filters?: Record<string, (string | number)[] | null>;
    [key: string]: any;
};
export declare type PaginationRequestFnType<D extends PaginationData> = (...params: [PaginationParams<D>, ...any[]]) => Promise<D>;
export interface PaginationReturnValue<D extends PaginationData> extends BaseReturnValue<D, [AntdPaginationParams<D>, ...any[]]> {
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
        dataSource: AntdPaginationItemType<D>[];
        loading: boolean;
        onChange: (pagination: PaginationConfig, filters?: Record<string, (string | number)[] | null>, sorter?: SorterResult<any> | SorterResult<any>[]) => void;
        pagination: PaginationConfig;
        [key: string]: any;
    };
    sorter?: SorterResult<any>;
    filters?: Record<string, (string | number)[] | null>;
}
export declare type AntdPaginationItemType<D> = PaginationItemType<D>;
export declare type AntdPaginationData<I extends any = any> = PaginationData<I>;
export declare type AntdPaginationOptions<D extends PaginationData> = PaginationOptions<D>;
export declare type AntdPaginationParams<D extends PaginationData> = PaginationParams<D>;
export declare type AntdPaginationRequestFnType<D extends PaginationData> = PaginationRequestFnType<D>;
export declare type AntdPaginationReturnValue<D extends PaginationData> = PaginationReturnValue<D>;
declare function useAntdPagination<D extends AntdPaginationData>(requestFn: AntdPaginationRequestFnType<D>, options?: AntdPaginationOptions<D>): AntdPaginationReturnValue<D>;
export default useAntdPagination;

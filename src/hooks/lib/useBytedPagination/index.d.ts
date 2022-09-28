import { PaginationProps } from '@bytedesign/web-react/es/Pagination/pagination';
import { SorterResult } from '@bytedesign/web-react/es/Table/interface';
import { BaseReturnValue } from '../useRequest/types';
import type { PaginationData, PaginationOptions, PaginationItemType } from '../usePagination';
export type { PaginationData, PaginationParams, PaginationRequestFnType, PaginationOptions, PaginationItemType, PaginationReturnValue, };
declare type PaginationParams<D extends PaginationData> = {
    data?: D;
    current: number;
    pageSize: number;
    sorter?: SorterResult;
    filters?: Partial<Record<keyof any, string[]>>;
    [key: string]: any;
};
declare type PaginationRequestFnType<D extends PaginationData> = (...params: [PaginationParams<D>, ...any[]]) => Promise<D>;
interface PaginationReturnValue<D extends PaginationData> extends BaseReturnValue<D, [PaginationParams<D>, ...any[]]> {
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        totalPage: number;
        onChange: (current: number, pageSize: number) => void;
        [key: string]: any;
    };
    tableProps: {
        data: PaginationItemType<D>[];
        loading: boolean;
        onChange: (pagination: PaginationProps, sorter?: SorterResult, filters?: Partial<Record<keyof any, string[]>>) => void;
        pagination: PaginationProps;
        [key: string]: any;
    };
    sorter?: SorterResult;
    filters?: Partial<Record<keyof any, string[]>>;
}
export declare type BytedPaginationData<I extends any = any> = PaginationData<I>;
export declare type BytedPaginationParams<D extends BytedPaginationData> = PaginationParams<D>;
export declare type BytedPaginationRequestFnType<D extends BytedPaginationData> = PaginationRequestFnType<D>;
export declare type BytedPaginationOptions<D extends BytedPaginationData> = PaginationOptions<D>;
export declare type BytedPaginationItemType<D> = PaginationItemType<D>;
export declare type BytedPaginationReturnValue<D extends PaginationData> = PaginationReturnValue<D>;
declare function useBytedPagination<D extends BytedPaginationData>(requestFn: BytedPaginationRequestFnType<D>, options?: BytedPaginationOptions<D>): BytedPaginationReturnValue<D>;
export default useBytedPagination;

import { PaginationProps } from '@arco-design/web-react/es/Pagination/pagination';
import { SorterResult } from '@arco-design/web-react/es/Table/interface';
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
export declare type ArcoPaginationData<I extends any = any> = PaginationData<I>;
export declare type ArcoPaginationParams<D extends ArcoPaginationData> = PaginationParams<D>;
export declare type ArcoPaginationRequestFnType<D extends ArcoPaginationData> = PaginationRequestFnType<D>;
export declare type ArcoPaginationOptions<D extends ArcoPaginationData> = PaginationOptions<D>;
export declare type ArcoPaginationItemType<D> = PaginationItemType<D>;
export declare type ArcoPaginationReturnValue<D extends ArcoPaginationData> = PaginationReturnValue<D>;
declare function useArcoPagination<D extends ArcoPaginationData, I extends any = any>(requestFn: ArcoPaginationRequestFnType<D>, options?: ArcoPaginationOptions<D>): ArcoPaginationReturnValue<D>;
export default useArcoPagination;

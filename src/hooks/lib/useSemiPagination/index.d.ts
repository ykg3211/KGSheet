import { PaginationProps } from '@ies/semi-ui-react/pagination';
import { BaseReturnValue } from '../useRequest/types';
import type { PaginationData, PaginationOptions, PaginationItemType } from '../usePagination';
export type { PaginationData, PaginationParams, PaginationRequestFnType, PaginationOptions, PaginationItemType, PaginationReturnValue, };
declare type SorterResult = {
    dataIndex: string;
    sortOrder: 'ascend' | 'descend' | false;
    [k: string]: any;
};
declare type Filters = {
    dataIndex: string;
    filteredValue: string[];
    [k: string]: any;
}[];
declare type PaginationParams<D extends PaginationData> = {
    data?: D;
    current: number;
    pageSize: number;
    sorter?: SorterResult;
    filters?: Filters;
    [key: string]: any;
};
declare type PaginationRequestFnType<D extends PaginationData> = (...params: [PaginationParams<D>, ...any[]]) => Promise<D>;
interface PaginationReturnValue<D extends PaginationData> extends BaseReturnValue<D, [PaginationParams<D>, ...any[]]> {
    pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
        totalPage: number;
        onChange: (current: number, pageSize: number) => void;
        [key: string]: any;
    };
    tableProps: {
        dataSource: PaginationItemType<D>[];
        loading: boolean;
        onChange: (params: {
            pagination: PaginationProps;
            sorter?: SorterResult;
            filters?: Filters;
        }) => void;
        pagination: PaginationProps;
        [key: string]: any;
    };
    sorter?: SorterResult;
    filters?: Filters;
}
export declare type SemiPaginationData<I extends any = any> = PaginationData<I>;
export declare type SemiPaginationParams<D extends SemiPaginationData> = PaginationParams<D>;
export declare type SemiPaginationRequestFnType<D extends SemiPaginationData> = PaginationRequestFnType<D>;
export declare type SemiPaginationOptions<D extends SemiPaginationData> = PaginationOptions<D>;
export declare type SemiPaginationItemType<D> = PaginationItemType<D>;
export declare type SemiPaginationReturnValue<D extends PaginationData> = PaginationReturnValue<D>;
declare function useSemiPagination<D extends SemiPaginationData>(requestFn: SemiPaginationRequestFnType<D>, options?: SemiPaginationOptions<D>): SemiPaginationReturnValue<D>;
export default useSemiPagination;

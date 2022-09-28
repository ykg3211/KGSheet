import type { PaginationData, PaginationParams, PaginationOptions, PaginationReturnValue } from '../useBytedPagination';
export interface Store {
    [name: string]: any;
}
export interface UseBytedTableFormUtils {
    setFieldsValue: (value: Store) => void;
    getFieldsValue: (...args: any) => Store;
    resetFields: (...args: any) => void;
    [key: string]: any;
}
export declare type TableData<I extends any = any> = PaginationData<I>;
export declare type BytedTableData<I extends any = any> = PaginationData<I>;
export declare type TableParams<D extends BytedTableData> = [PaginationParams<D>, Object?];
export declare type BytedTableParams<D extends BytedTableData> = TableParams<D>;
export declare type TableRequestFnType<D extends BytedTableData> = (...params: BytedTableParams<D>) => Promise<D>;
export declare type BytedTableRequestFnType<D extends BytedTableData> = TableRequestFnType<D>;
export interface TableReturnValue<D extends PaginationData> extends PaginationReturnValue<D> {
    search: {
        type: 'simple' | 'advance';
        changeType: () => void;
        submit: (e?: any) => void;
        reset: () => void;
    };
}
export declare type BytedTableReturnValue<D extends PaginationData> = TableReturnValue<D>;
export interface TableOptions<D extends PaginationData> extends Omit<PaginationOptions<D>, 'defaultParams'> {
    defaultParams?: [Partial<PaginationParams<D>>, Object?];
    form?: UseBytedTableFormUtils;
    defaultType?: 'simple' | 'advance';
    noResetCurrent?: boolean;
    noResetForm?: boolean;
}
export declare type BytedTableOptions<D extends PaginationData> = TableOptions<D>;
declare function useBytedTable<D extends BytedTableData>(requestFn: BytedTableRequestFnType<D>, options?: BytedTableOptions<D>): BytedTableReturnValue<D>;
export default useBytedTable;

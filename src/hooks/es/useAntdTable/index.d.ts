import type { PaginationData, PaginationParams, PaginationOptions, PaginationReturnValue } from '../useAntdPagination';
export interface Store {
    [name: string]: any;
}
export interface UseAntdTableFormUtils {
    getFieldInstance?: (name: string) => {};
    setFieldsValue: (value: Store) => void;
    getFieldsValue: (...args: any) => Store;
    resetFields: (...args: any) => void;
    [key: string]: any;
}
export declare type TableData<I extends any = any> = PaginationData<I>;
export declare type AntdTableData<I extends any = any> = PaginationData<I>;
export declare type TableParams<D extends TableData> = [PaginationParams<D>, Object?];
export declare type AntdTableParams<D extends TableData> = TableParams<D>;
export declare type TableRequestFnType<D extends TableData> = (...params: TableParams<D>) => Promise<D>;
export declare type AntdTableRequestFnType<D extends TableData> = TableRequestFnType<D>;
export interface TableReturnValue<D extends PaginationData> extends PaginationReturnValue<D> {
    search: {
        type: 'simple' | 'advance';
        changeType: () => void;
        submit: (e?: any) => void;
        reset: () => void;
    };
}
export declare type AntdTableReturnValue<D extends PaginationData> = TableReturnValue<D> & PaginationReturnValue<D>;
export interface TableOptions<D extends PaginationData> extends Omit<PaginationOptions<D>, 'defaultParams'> {
    defaultParams?: [Partial<PaginationParams<D>>, Object?];
    form?: UseAntdTableFormUtils;
    defaultType?: 'simple' | 'advance';
    noResetCurrent?: boolean;
    noResetForm?: boolean;
}
export declare type AntdTableOptions<D extends PaginationData> = TableOptions<D>;
declare function useAntdTable<D extends AntdTableData>(requestFn: AntdTableRequestFnType<D>, options?: AntdTableOptions<D>): AntdTableReturnValue<D>;
export default useAntdTable;

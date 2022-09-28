import type { PaginationData, PaginationParams, PaginationOptions, PaginationReturnValue } from '../useArcoPagination';
export interface Store {
    [name: string]: any;
}
export interface useArcoTableFormUtils {
    setFieldsValue: (value: Store) => void;
    getFieldsValue: (...args: any) => Store;
    resetFields: (...args: any) => void;
    [key: string]: any;
}
export declare type TableData<I extends any = any> = PaginationData<I>;
export declare type ArcoTableData<I extends any = any> = PaginationData<I>;
export declare type TableParams<D extends TableData> = [PaginationParams<D>, Object?];
export declare type ArcoTableParams<D extends ArcoTableData> = TableParams<D>;
export declare type TableRequestFnType<D extends TableData> = (...params: TableParams<D>) => Promise<D>;
export declare type ArcoTableRequestFnType<D extends ArcoTableData> = TableRequestFnType<D>;
export interface TableReturnValue<D extends PaginationData> extends PaginationReturnValue<D> {
    search: {
        type: 'simple' | 'advance';
        changeType: () => void;
        submit: (e?: any) => void;
        reset: () => void;
    };
}
export declare type ArcoTableReturnValue<D extends PaginationData> = TableReturnValue<D>;
export interface TableOptions<D extends PaginationData> extends Omit<PaginationOptions<D>, 'defaultParams'> {
    defaultParams?: [Partial<PaginationParams<D>>, Object?];
    form?: useArcoTableFormUtils;
    defaultType?: 'simple' | 'advance';
    noResetCurrent?: boolean;
    noResetForm?: boolean;
}
export declare type ArcoTableOptions<D extends PaginationData> = TableOptions<D>;
declare function useArcoTable<D extends ArcoTableData>(requestFn: ArcoTableRequestFnType<D>, options?: ArcoTableOptions<D>): ArcoTableReturnValue<D>;
export default useArcoTable;

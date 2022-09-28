/// <reference types="react" />
import type { PaginationData, PaginationParams, PaginationOptions, PaginationReturnValue } from '../useSemiPagination';
export interface Store {
    [name: string]: any;
}
export interface UseSemiTableFormUtils {
    setValues: (value: Store) => void;
    getValues: (...args: any) => Store;
    reset: (...args: any) => void;
    [key: string]: any;
}
export declare type TableData<I extends any = any> = PaginationData<I>;
export declare type SemiTableData<I extends any = any> = PaginationData<I>;
export declare type TableParams<D extends SemiTableData> = [PaginationParams<D>, Object?];
export declare type SemiTableParams<D extends SemiTableData> = TableParams<D>;
export declare type TableRequestFnType<D extends SemiTableData> = (...params: SemiTableParams<D>) => Promise<D>;
export declare type SemiTableRequestFnType<D extends SemiTableData> = TableRequestFnType<D>;
export interface TableReturnValue<D extends PaginationData> extends PaginationReturnValue<D> {
    search: {
        type: 'simple' | 'advance';
        changeType: () => void;
        submit: (e?: any) => void;
        reset: () => void;
    };
}
export declare type SemiTableReturnValue<D extends PaginationData> = TableReturnValue<D>;
export interface TableOptions<D extends PaginationData> extends Omit<PaginationOptions<D>, 'defaultParams'> {
    defaultParams?: [Partial<PaginationParams<D>>, Object?];
    formApiRef?: React.MutableRefObject<UseSemiTableFormUtils>;
    defaultType?: 'simple' | 'advance';
    noResetCurrent?: boolean;
    noResetForm?: boolean;
}
export declare type SemiTableOptions<D extends PaginationData> = TableOptions<D>;
declare function useSemiTable<D extends SemiTableData>(requestFn: SemiTableRequestFnType<D>, options?: SemiTableOptions<D>): SemiTableReturnValue<D>;
export default useSemiTable;

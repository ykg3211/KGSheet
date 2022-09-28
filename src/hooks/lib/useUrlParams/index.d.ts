import { Dispatch, SetStateAction } from 'react';
import { ParseOptions, StringifyOptions } from 'query-string';
export interface ReturnValue<T> {
    value: KeysObj<T>;
    setValue: Dispatch<SetStateAction<T>>;
    resetParams: (initial?: boolean) => void;
}
export declare type KeyValue = {
    [key: string]: any;
};
export declare type KeysObj<T> = {
    [key in keyof T]: any;
};
interface IOptions {
    omitKeys?: string[];
    autoFormat?: boolean;
    autoMergeUrlParams?: boolean;
    parseOptions?: ParseOptions;
    stringifyOptions?: StringifyOptions;
    replaceUrl?: boolean;
}
declare function useUrlParams<T>(initValue?: T, options?: IOptions): ReturnValue<T>;
export default useUrlParams;

import { DependencyList } from 'react';
export interface ReturnValue<T extends any[]> {
    run: (...args: T) => void;
    cancel: () => void;
}
export interface IUseDebounceFnOptions {
    immediately?: boolean;
    trailing?: boolean;
    leading?: boolean;
}
declare function useDebounceFn<T extends any[]>(fn: (...args: T) => any, wait?: number, deps?: DependencyList, options?: IUseDebounceFnOptions): ReturnValue<T>;
export default useDebounceFn;

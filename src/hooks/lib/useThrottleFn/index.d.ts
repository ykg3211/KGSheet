import { DependencyList } from 'react';
export interface ReturnValue<T extends any[]> {
    run: (...args: T) => void;
    cancel: () => void;
}
export interface IUseThrottleFnOption {
    immediately?: boolean;
    trailing?: boolean;
    leading?: boolean;
}
declare function useThrottleFn<T extends any[]>(fn: (...args: T) => any, wait?: number, deps?: DependencyList, options?: IUseThrottleFnOption): ReturnValue<T>;
export default useThrottleFn;

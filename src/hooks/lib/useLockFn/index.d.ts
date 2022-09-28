declare function useLockFn(fn: (...args: any[]) => any): (...args: any[]) => Promise<any>;
export default useLockFn;

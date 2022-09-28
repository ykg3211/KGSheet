export interface IFuncUpdater<T> {
    (previousState?: T): T;
}
declare function useStorage<T>(key: string, defaultValue: T, storage?: Storage, raw?: boolean): [T, (value?: T | IFuncUpdater<T>) => void];
declare function useStorage<T>(key: string, defaultValue?: T, storage?: Storage, raw?: boolean): [T | undefined, (value?: T | IFuncUpdater<T>) => void];
export default useStorage;

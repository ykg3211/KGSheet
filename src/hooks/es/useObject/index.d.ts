import { ImmerProducer } from './../useImmer/index';
export interface PlainObject {
    [key: string]: any;
}
declare type PlainObjectValue<T> = T extends {
    [key: string]: infer P;
} ? P : never;
export interface ActionTypes<T> {
    setState: (next: T | ImmerProducer<T>) => void;
    reset: () => {};
    merge: (other: Partial<T>) => T;
    set: (key: string, value: any) => T;
    delete: (key: string) => T;
    deleteAll: (keys: Iterable<string>) => T;
    map: (iteratee: (item: [string, PlainObjectValue<T>]) => PlainObjectValue<T>) => T;
    filter: (predicate: (item: [string, PlainObjectValue<T>]) => boolean) => T;
    union: (other: Partial<T>) => T;
    intersect: (other: Partial<T>) => T;
    difference: (other: Partial<T>) => T;
    clear: () => {};
}
declare function useObject<T extends PlainObject = {}>(): {
    state: T | {};
} & ActionTypes<T>;
declare function useObject<T extends PlainObject = {}>(initialValue: T): {
    state: T;
} & ActionTypes<T>;
export default useObject;

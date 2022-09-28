interface PlainObject<V> {
    [key: string]: V;
}
export default function useMap<K, V, P extends Iterable<[K, V]>>(initialValue?: P extends Iterable<[K, V]> ? Iterable<[K, V]> : PlainObject<V>): {
    set: (key: K, value: V) => void;
    setAll: (entries: Iterable<[K, V]>) => void;
    delete: (key: K) => void;
    deleteAll: (keys: Iterable<K>) => void;
    map: (iteratee: (item: [K, V]) => V) => void;
    filter: (predicate: (item: [K, V]) => boolean) => void;
    union: (other: Map<K, V>) => void;
    intersect: (other: Map<K, V>) => void;
    difference: (other: Map<K, V>) => void;
    clear: () => void;
    state: any;
    setState: (value: P extends Iterable<[K, V]> ? Iterable<[K, V]> : PlainObject<V>) => void;
    reset: () => void;
};
export {};

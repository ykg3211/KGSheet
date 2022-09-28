export default function useSet<T>(initialValue?: Iterable<T>): {
    add: (item: T) => void;
    addAll: (items: Iterable<T>) => void;
    delete: (item: T) => void;
    deleteAll: (items: Iterable<T>) => void;
    toggle: (item: T) => void;
    toggleAll: (items: Iterable<T>) => void;
    map: (iteratee: (item: T) => T) => void;
    filter: (predicate: (item: T) => boolean) => void;
    union: (other: Set<T>) => void;
    intersect: (other: Set<T>) => void;
    difference: (other: Set<T>) => void;
    clear: () => void;
    state: Set<T>;
    setState: (value: Iterable<T>) => void;
    reset: () => void;
};

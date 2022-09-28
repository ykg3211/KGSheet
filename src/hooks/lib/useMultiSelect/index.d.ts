export interface IMultiSelectReturn<T> {
    selected: T[];
    isSelected: (item: T) => boolean;
    select: (item: T) => void;
    unSelect: (item: T) => void;
    toggle: (item: T) => void;
    selectAll: () => void;
    unSelectAll: () => void;
    toggleAll: () => void;
    allSelected: boolean;
    noneSelected: boolean;
    partiallySelected: boolean;
    setSelected: (item: T[]) => void;
    setMultiSelected: (item: T[]) => void;
}
declare type Indexable = string | number;
interface Options<T> {
    isMulti?: boolean;
    defaultSelected?: T[];
    dataKey?: Indexable | ((selected: T) => Indexable);
}
export default function useMultiSelect<T>(items: T[], options?: Options<T>): IMultiSelectReturn<T>;
export {};

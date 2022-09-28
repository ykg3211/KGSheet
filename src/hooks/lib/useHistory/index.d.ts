export interface ReducerStateProps<T = any> {
    past: T[];
    present: T;
    future: T[];
}
export declare enum ACTION_TYPE {
    UNDO = 0,
    REDO = 1,
    SET = 2,
    CLEAR = 3
}
export interface ReturnValue<T> {
    state: T;
    set: (newPresent: T) => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    canUndo: boolean;
    canRedo: boolean;
}
declare function useHistory<T>(initialPresent: T): ReturnValue<T>;
export default useHistory;

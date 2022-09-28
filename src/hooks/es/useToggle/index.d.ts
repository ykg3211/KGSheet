declare type State = any;
export interface ReturnValue<T = State> {
    state: T;
    toggle: (value?: T) => void;
}
declare function useToggle<T = boolean>(): ReturnValue<T>;
declare function useToggle<T = State>(defaultValue: T): ReturnValue<T>;
declare function useToggle<T = State, U = State>(defaultValue: T, reverseValue: U): ReturnValue<T | U>;
export default useToggle;

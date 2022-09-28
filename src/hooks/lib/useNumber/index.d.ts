export interface Options {
    min?: number;
    max?: number;
}
export interface ReturnValue {
    state: number;
    inc: (delta?: number) => void;
    dec: (delta?: number) => void;
    set: (value: number | ((c: number) => number)) => void;
    reset: () => void;
}
declare function useNumber(initialValue?: number, options?: Options): ReturnValue;
export default useNumber;

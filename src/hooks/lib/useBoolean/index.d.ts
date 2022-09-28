export interface ReturnValue {
    state: boolean;
    setTrue: () => void;
    setFalse: () => void;
    toggle: (value?: boolean) => void;
}
declare const _default: (initialValue?: boolean | undefined) => ReturnValue;
export default _default;

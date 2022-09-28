export interface Options<T> {
    defaultValue?: T;
    defaultValuePropName?: string;
    valuePropName?: string;
    onChangePropName?: string;
}
export interface Props {
    [key: string]: any;
}
interface StandardProps<T> {
    value: T;
    defaultValue?: T;
    onChange: (val: T) => void;
}
declare function useControlled<T = any>(props: StandardProps<T>): [T, (val: T) => void];
declare function useControlled<T = any>(props?: Props, options?: Options<T>): [T, (v: T, ...args: any[]) => void];
export default useControlled;

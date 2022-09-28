export interface NativeReducers<S> {
    [key: string]: (state: S, ...args: any[]) => S;
}
export interface ImmerReducers<S> {
    [key: string]: (state: S, ...args: any[]) => S | void;
}
declare type Strip<T> = T extends (state: any, ...args: infer P) => any ? (...args: P) => void : never;
export declare type Actions<S, R extends NativeReducers<S> | ImmerReducers<S>> = {
    [K in keyof R]: Strip<R[K]>;
};
export {};

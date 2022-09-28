import { Dispatch } from 'react';
export declare type ImmerProducer<S> = ((state: S) => S | void) | ((state: S) => Promise<void>);
export declare function useImmerState<S = any>(initialState: undefined): [S | undefined, (next: S | ImmerProducer<S>, isAsync?: boolean) => void];
export declare function useImmerState<S = any>(initialState: S | (() => S)): [S, (next: S | ImmerProducer<S>, isAsync?: boolean) => void];
export declare function useImmerReducer<S = any, A = any>(reducer: (state: S, action: A) => S | void, initialState: S, initializer?: () => S): [S, Dispatch<A>];
export default useImmerState;

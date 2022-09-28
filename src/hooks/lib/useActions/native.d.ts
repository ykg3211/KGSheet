import { Dispatch, SetStateAction } from 'react';
import { NativeReducers, Actions } from './interface';
export declare type NativeActionsHook<S, R extends NativeReducers<S>> = [S, Actions<S, R>, Dispatch<SetStateAction<S>>, () => void];
export declare function useActionsExtensionNative<S, R extends NativeReducers<S>>(reducers: R, setState: Dispatch<SetStateAction<S>>): Actions<S, R>;
export declare function useActionsNative<S, R extends NativeReducers<S>>(reducers: R, initialState: S | (() => S)): NativeActionsHook<S, R>;

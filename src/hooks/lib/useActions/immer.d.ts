import { ImmerProducer } from '../useImmer';
import { ImmerReducers, Actions } from './interface';
declare type SetImmerState<S> = (next: S | ImmerProducer<S>) => void;
export declare type ActionsHook<S, R extends ImmerReducers<S>> = [S, Actions<S, R>, SetImmerState<S>, () => void];
export declare function useActionsExtension<S, R extends ImmerReducers<S>>(reducers: R, setState: SetImmerState<S>): Actions<S, R>;
export declare function useActions<S, R extends ImmerReducers<S>>(reducers: R, initialState: S | (() => S)): ActionsHook<S, R>;
export {};

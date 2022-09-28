import { DependencyList } from 'react';
export declare type Cleanup = void | (() => void);
export declare type AsyncEffectCallback = () => Promise<Cleanup>;
declare const useAsyncEffect: (asyncCallback: AsyncEffectCallback, deps?: DependencyList | undefined) => void;
export default useAsyncEffect;

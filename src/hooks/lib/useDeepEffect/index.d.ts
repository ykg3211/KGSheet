import React from 'react';
export declare function useDeepEffect<T>(callback: React.EffectCallback, deps: T[]): void;
export declare function useDeepEffect<T>(callback: React.EffectCallback, isEqual: (cur: T[], prev: T[]) => boolean, deps: T[]): void;
export default useDeepEffect;

import React from 'react';
export interface IMutationOptions {
    mutationObserverInit?: MutationObserverInit;
    callback?: MutationCallback;
}
declare const useMutation: <T extends HTMLElement = any>(el?: T | (() => T) | undefined, options?: IMutationOptions, deps?: any[]) => [React.MutableRefObject<T>];
export default useMutation;

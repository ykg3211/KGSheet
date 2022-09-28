import React from 'react';
declare type Options = {
    onEnter?: () => void;
    onLeave?: () => void;
};
declare const useHover: <T extends HTMLElement = any>(el?: T | (() => T) | undefined, options?: Options, deps?: React.DependencyList) => [React.MutableRefObject<T>, boolean];
export default useHover;

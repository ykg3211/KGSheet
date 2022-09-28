import React from 'react';
declare type Options<T> = {
    el?: T | (() => T);
    default?: boolean;
    direction?: 'x' | 'y';
};
export interface Result<T> {
    isLock: boolean;
    lock: () => void;
    unlock: () => void;
    toggle: () => void;
    ref: React.MutableRefObject<T>;
}
declare const useScrollLock: <T extends HTMLElement = any>(options?: Options<T>) => Result<T>;
export default useScrollLock;

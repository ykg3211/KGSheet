import React from 'react';
declare type Options<T> = {
    el?: T | (() => T);
    default?: boolean;
    scrollLock?: boolean;
    escClose?: boolean;
};
export interface Result<T> {
    Portal: React.FC;
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    ref: React.MutableRefObject<T>;
}
declare const usePortal: <T extends HTMLElement = any>(options?: Options<T>) => Result<T>;
export default usePortal;

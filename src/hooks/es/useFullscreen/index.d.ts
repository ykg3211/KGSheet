import { MutableRefObject } from 'react';
export interface Options<T> {
    defaultValue?: boolean;
    onExitFull?: () => void;
    onFull?: () => void;
}
export interface Result<T> {
    isFullscreen: boolean;
    setFull: () => void;
    exitFull: () => void;
    toggleFull: () => void;
    ref?: MutableRefObject<T>;
}
declare const _default: <T extends HTMLElement = any>(el?: T | (() => T) | undefined, options?: Options<T> | undefined) => Result<T>;
export default _default;

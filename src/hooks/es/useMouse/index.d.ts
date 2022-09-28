import React from 'react';
declare type State = {
    x: number;
    y: number;
};
declare type Options = {
    throttle?: number;
};
declare const useMouse: <T extends HTMLElement = any>(el?: Window | T | (() => T) | undefined, options?: Options | undefined, deps?: any[]) => [React.MutableRefObject<T>, State];
export default useMouse;

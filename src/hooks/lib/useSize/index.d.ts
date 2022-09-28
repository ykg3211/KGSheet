import React from 'react';
declare type Size = {
    width: number;
    height: number;
};
declare type Dimension = 'width' | 'height';
interface Options {
    throttle?: number;
    dimension?: Dimension;
}
declare const useSize: <T extends HTMLElement = any>(el?: T | (() => T) | undefined, options?: Options | Dimension, deps?: any[]) => [React.MutableRefObject<T>, Size];
export default useSize;

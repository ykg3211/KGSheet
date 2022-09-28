import React from 'react';
import { ScrollDataType, Options } from './utils';
declare const useScroll: <T extends HTMLElement = any>(el?: Window | T | (() => T) | undefined, options?: Options, deps?: any[]) => [React.MutableRefObject<T>, ScrollDataType];
export default useScroll;

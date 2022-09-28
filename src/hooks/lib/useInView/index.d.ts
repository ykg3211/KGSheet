import React from 'react';
import 'intersection-observer';
declare const useInView: <T extends HTMLElement = any>(el?: T | (() => T) | undefined, options?: IntersectionObserverInit | undefined, deps?: any[]) => [React.MutableRefObject<T>, boolean];
export default useInView;

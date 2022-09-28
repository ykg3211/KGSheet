import React from 'react';
import { ElementShape } from './utils';
export interface ReturnValue<T1, T2> {
    refs: [React.MutableRefObject<T1>, React.MutableRefObject<T2>];
    distance: number;
    intersect: boolean;
}
declare const useIntersect: <T1 extends HTMLElement = any, T2 extends HTMLElement = any>(shapes?: [ElementShape, ElementShape], deps?: any[]) => ReturnValue<T1, T2>;
export default useIntersect;

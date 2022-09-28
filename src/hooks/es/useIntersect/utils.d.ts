export declare type ElementShape = 'rect' | 'circle';
export declare const getDistanceAndIntersect: <T1 extends HTMLElement, T2 extends HTMLElement>(els: [T1, T2], shapes: [ElementShape, ElementShape]) => [number, boolean];

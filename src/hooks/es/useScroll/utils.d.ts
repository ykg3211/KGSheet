/// <reference types="react" />
declare type DirectionType = {
    x: string | null;
    y: string | null;
};
declare type XYType = {
    x: number;
    y: number;
};
export declare type ScrollDataType = {
    scrolling: boolean;
    time: number;
    direction: DirectionType;
    speed: XYType;
    totalDistance: XYType;
    relativeDistance: XYType;
    offset: XYType;
};
export declare type Options = {
    onScroll?: (data: ScrollDataType) => void;
    onScrollStart?: (data: ScrollDataType) => void;
    onScrollEnd?: (data: ScrollDataType) => void;
    ref?: React.MutableRefObject<any>;
};
export declare const INITIAL_DATA: ScrollDataType;
export declare const DEFAULT_TIMEOUT = 100;
export declare function getDirectionX(x: number, toData: ScrollDataType): string | null;
export declare function getDirectionY(y: number, toData: ScrollDataType): string | null;
export declare function getTotalDistanceX(x: number, toData: ScrollDataType): number;
export declare function getTotalDistanceY(y: number, toData: ScrollDataType): number;
export declare function getRelativeDistanceX(x: number, fromData: ScrollDataType): number;
export declare function getRelativeDistanceY(y: number, fromData: ScrollDataType): number;
export declare function getSpeedX(x: number, toData: ScrollDataType, timestampDiff: number): number;
export declare function getSpeedY(y: number, toData: ScrollDataType, timestampDiff: number): number;
export {};

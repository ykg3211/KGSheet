import React from 'react';
declare type RefType = React.MutableRefObject<HTMLImageElement | undefined>;
export interface ReturnValue {
    ref: RefType;
    curSrc: string | undefined;
    loadStartState: boolean;
    loadedState: boolean;
    errorState: ErrorEvent | null;
}
interface SrcOptions {
    loadingSrc?: string | (() => string);
    fallbackSrc?: string | (() => string);
}
declare const useLazyImg: (src: string | (() => string), srcOptions?: SrcOptions, options?: IntersectionObserverInit | undefined) => ReturnValue;
export default useLazyImg;

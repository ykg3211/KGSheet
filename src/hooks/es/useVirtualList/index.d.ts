import { UIEvent } from 'react';
export interface OptionType<T> {
    itemHeight: number | ((data: T, index: number) => number);
    overscan?: number;
    onScroll?: (e: UIEvent<HTMLElement>) => void;
}
declare const _default: <T>(originalList: T[], options: OptionType<T>, deps?: any[]) => {
    list: {
        data: T;
        index: number;
    }[];
    scrollTo: (index: number) => void;
    scrollerRef: import("react").MutableRefObject<HTMLDivElement>;
    scrollerProps: {
        ref: import("react").MutableRefObject<HTMLDivElement>;
        onScroll: (e: UIEvent<HTMLElement>) => void;
        style: {
            overflowY: 'auto';
        };
    };
    wrapperProps: {
        style: {
            width: string;
            height: number;
            paddingTop: number;
        };
    };
};
export default _default;

/// <reference types="react" />
declare type Target = Window | HTMLElement | undefined | null;
export interface Options {
    target?: Target | (() => Target);
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}
export default function useEventListener<T extends HTMLElement = any>(eventName: string, eventListener: Function, options?: Options): import("react").MutableRefObject<T>;
export {};

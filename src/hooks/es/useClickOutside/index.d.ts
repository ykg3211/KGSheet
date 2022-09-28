import { MutableRefObject } from 'react';
declare type RefType = HTMLElement | (() => HTMLElement | null) | null | undefined;
export default function useClickOutside<T extends HTMLElement = any>(dom: RefType, onClickAway: (event: KeyboardEvent) => void, eventName?: string): MutableRefObject<T>;
export {};

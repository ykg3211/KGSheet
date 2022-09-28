import { EventType, Handler } from './mitt';
export declare const emitter: import("./mitt").Emitter;
export declare function useEventBus<T extends any[] = any[]>(eventName: EventType): {
    trigger: Handler<T>;
};
export declare function useEventBus<T extends any[] = any[]>(eventName: EventType, callback: Handler<T>): {
    trigger: Handler<T>;
    unsubscribe: () => void;
    subscribe: () => void;
};
export default function useEventBus<T extends any[] = any[]>(eventName: EventType, callback?: Handler<T>): {
    trigger: (...args: T) => void;
    unsubscribe: () => void;
    subscribe: () => void;
} | {
    trigger: (...args: T) => void;
    unsubscribe?: undefined;
    subscribe?: undefined;
};

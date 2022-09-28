export declare type EventType = string | symbol;
export declare type Handler<T extends any[] = any[]> = (...args: T) => void;
export declare type WildcardHandler = (type: EventType, ...args: any[]) => void;
export declare type EventHandlerList = Array<Handler>;
export declare type WildCardEventHandlerList = Array<WildcardHandler>;
export declare type EventHandlerMap = Map<EventType, EventHandlerList | WildCardEventHandlerList>;
export interface Emitter {
    all: EventHandlerMap;
    on<T extends any[] = any[]>(type: EventType, handler: Handler<T>): void;
    on(type: '*', handler: WildcardHandler): void;
    off<T extends any[] = any[]>(type: EventType, handler: Handler<T>): void;
    off(type: '*', handler: WildcardHandler): void;
    emit<T extends any[] = any[]>(type: EventType, ...args: T): void;
    emit(type: '*', ...args: any[]): void;
}
/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * modify from mitt https://www.npmjs.com/package/mitt
 * support multiple event arguments callback
 *
 * @name mitt
 * @returns {Mitt}
 */
export declare function mitt(_all?: EventHandlerMap): Emitter;

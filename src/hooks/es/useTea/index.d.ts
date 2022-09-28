import type Tea from 'byted-tea-sdk';
declare type Options = {
    channel?: string;
    log?: boolean;
    test?: boolean;
    evtParams?: {
        [key: string]: any;
    };
    configParams?: {
        [key: string]: any;
    };
    ifMountToWindow?: boolean;
    sendFnName?: string;
};
declare type Result = {
    send: typeof Tea;
    loaded: boolean;
    error: ErrorEvent | null;
};
declare global {
    interface Window {
        collectEvent: typeof Tea;
    }
}
declare const useTea: (appId: number, options?: Options) => Result;
export default useTea;

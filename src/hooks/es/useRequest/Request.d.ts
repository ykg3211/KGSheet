/// <reference types="lodash" />
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import "core-js/modules/es.promise.finally";
import type { BaseOptions, BaseRequestFnType, BaseReturnValue, ChangeData, RequestsStateType } from './types';
declare class Request<D, P extends any[]> {
    options: BaseOptions<D, P>;
    requestFn: BaseRequestFnType<D, P>;
    debounceFn: ReturnType<typeof debounce> | undefined;
    throttleFn: ReturnType<typeof throttle> | undefined;
    pollingTimer: number | undefined;
    private count;
    unmountedFlag: boolean;
    that: any;
    onChangeState: ((data: RequestsStateType<D, P>) => void) | undefined;
    state: RequestsStateType<D, P>;
    constructor(requestFn: BaseRequestFnType<D, P>, options: BaseOptions<D, P>, onChangeState: (data: RequestsStateType<D, P>) => void, initState?: {
        data?: any;
        error?: any;
        params?: any;
        loading?: any;
    });
    setState(s?: Partial<BaseReturnValue<D, P>>): void;
    cancelPolling(): void;
    dontPolling(): void;
    _run(...params: P): Promise<any>;
    run(...params: P): Promise<any>;
    cancel(): void;
    unmount(): void;
    refresh(): Promise<any>;
    refreshOptions(options?: Partial<BaseOptions<D, P>>): Promise<any>;
    changeData(FnOrData: ChangeData<D>): void;
}
export default Request;

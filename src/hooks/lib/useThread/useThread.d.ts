import { THREAD_TASK_STATUS } from './utils';
declare type Options = {
    timeout?: number;
    remoteDependencies?: string[];
};
declare const useThread: <T extends (...fnArgs: any[]) => any>(fn: T, options?: Options) => [(...fnArgs: Parameters<T>) => Promise<ReturnType<T>>, THREAD_TASK_STATUS, () => void];
export default useThread;

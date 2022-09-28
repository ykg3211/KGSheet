import { THREAD_TASK_STATUS } from './utils';
declare type Options = {
    size?: number;
    timeout?: number;
    remoteDependencies?: string[];
};
declare const useThreadPool: <T extends (...fnArgs: any[]) => any>(fn: T, options: Options) => [(...fnArgs: Parameters<T>) => [Promise<ReturnType<T>>, number], {
    kill: (id: number, status?: THREAD_TASK_STATUS | undefined) => void;
    getStatus: (id: number) => THREAD_TASK_STATUS | undefined;
    getFreeCount: () => number;
    getPendingCount: () => number;
    getRuningCount: () => number;
}];
export default useThreadPool;

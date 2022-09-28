export declare enum THREAD_TASK_STATUS {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    RUNNING = "RUNNING",
    ERROR = "ERROR",
    TIMEOUT = "TIMEOUT",
    KILLED = "KILLED"
}
/**
 * Converts the "fn" function into the syntax needed to be executed within a web worker
 *
 * @param {Function} fn the function to run with web worker
 * @param {Array.<String>} deps array of strings, imported into the worker through "importScripts"
 *
 * @returns {String} a blob url, containing the code of "fn" as a string
 *
 * @example
 * createWorkerBlobUrl((a,b) => a+b, [])
 * // return "onmessage=return Promise.resolve((a,b) => a + b)
 * .then(postMessage(['SUCCESS', result]))
 * .catch(postMessage(['ERROR', error])"
 */
declare const createWorkerBlobUrl: (fn: Function, deps?: string[]) => string;
export { createWorkerBlobUrl };

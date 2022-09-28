import { SetStateAction, Dispatch } from 'react';
export declare const useResetState: <T>(init: () => T, autoReset: boolean, deps: any[]) => [T, Dispatch<SetStateAction<T>>, () => void];
export default useResetState;

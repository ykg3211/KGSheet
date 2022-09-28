import { Dispatch, SetStateAction } from 'react';
declare function useStateRealtime<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>, () => T];
declare function useStateRealtime<T = undefined>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => T | undefined];
export default useStateRealtime;

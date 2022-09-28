declare const useDeepMemo: <T>(value: T, isEqual?: (prev: T, cur: T) => boolean) => T;
export default useDeepMemo;

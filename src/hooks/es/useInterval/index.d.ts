import { DependencyList } from 'react';
interface IUseIntervalOptions {
    deps?: DependencyList;
}
declare const useInterval: (callback: Function, delay: number, immediate?: boolean, options?: IUseIntervalOptions) => {
    run: () => void;
    cancel: () => void;
};
export default useInterval;

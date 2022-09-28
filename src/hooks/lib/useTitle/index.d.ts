interface Options {
    defaultTitle?: string;
    prefix?: string;
    suffix?: string;
    onChange?: (title: string, oldTitle: string) => void;
}
declare const useTitle: (title: string | (() => string | Promise<string> | void), options?: Options, deps?: any[]) => void;
export default useTitle;

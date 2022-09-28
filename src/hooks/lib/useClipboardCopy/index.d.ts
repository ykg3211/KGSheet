/// <reference types="react" />
declare type Options = {
    onSuccess?: (text: string) => void;
    onError?: (error: any) => void;
};
declare type Result<T> = {
    ref: React.MutableRefObject<T | undefined>;
    isSupported: boolean;
    isCopied: boolean;
    copyText: string;
    copy: (text?: string | undefined) => void;
    cut: () => void;
    clear: () => void;
};
declare const useClipboardCopy: <T extends HTMLElement = any>(options?: Options) => Result<T>;
export default useClipboardCopy;

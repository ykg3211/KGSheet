declare type ScriptProperties = {
    [K in keyof HTMLScriptElement]?: HTMLScriptElement[K];
};
declare const useScript: (src: string, properties?: ScriptProperties | undefined) => [boolean, ErrorEvent | null];
export default useScript;

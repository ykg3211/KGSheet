import type { Options, ReturnValue, UploadItem, UploadRequest, UploadResult } from './types';
declare const useUpload: <FileItem extends unknown>(options: Options<FileItem>) => ReturnValue<FileItem>;
export type { Options, ReturnValue, UploadItem, UploadRequest, UploadResult };
export default useUpload;

/// <reference types="react" />
export declare type UploadResult<FileItem = any> = {
    file?: FileItem;
    success: boolean;
    error?: any;
};
export declare type UploadItem = {
    key: string;
    file: File;
    state: {
        progress: number;
        success: boolean;
        error: any;
    };
    previewUrl?: string;
};
export declare type UploadRequest<FileItem = any> = (file: File, onProgress?: (progress: number) => void, fileArr?: File[]) => Promise<UploadResult<FileItem>>;
export declare type Options<FileItem = any> = {
    disabled?: boolean;
    multiple?: boolean;
    accept?: string;
    defaultList?: FileItem[];
    uploadRequest: UploadRequest<FileItem>;
    beforeUpload?: (files: FileList, e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => void | boolean | Promise<boolean> | File[] | Promise<File[]>;
};
export declare type ReturnValue<FileItem = any> = {
    inputProps: {
        ref: React.MutableRefObject<HTMLInputElement | undefined>;
        type: 'file';
        style: {
            display: 'none';
        };
        disabled: boolean;
        accept: any;
        multiple: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
    dropProps: {
        ref: React.MutableRefObject<HTMLDivElement | undefined>;
        onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    };
    fileList: FileItem[];
    uploadList: UploadItem[];
    trigger: () => void;
    download: (file: File | UploadItem) => void;
    reUpload: (item: UploadItem) => void;
    removeUploadItem: (item: UploadItem) => void;
    removeFile: (file: FileItem) => void;
    setUploadList: React.Dispatch<React.SetStateAction<UploadItem[]>>;
    setFileList: React.Dispatch<React.SetStateAction<FileItem[]>>;
};

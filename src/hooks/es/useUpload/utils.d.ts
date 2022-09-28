import type { UploadItem } from './types';
declare function getPreviewUrl(file: File): string;
declare const getKey: () => string;
declare const download: (file: File | UploadItem) => void;
export { getPreviewUrl, getKey, download };

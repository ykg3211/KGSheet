declare type mediaFetures = 'width' | 'minWidth' | 'maxWidth' | 'height' | 'minHeight' | 'maxHeight' | 'deviceWidth' | 'minDeviceWidth' | 'maxDeviceWidth' | 'deviceHeight' | 'minDeviceHeight' | 'maxDeviceHeight' | 'aspectRatio' | 'minAspectRatio' | 'maxAspectRatio' | 'deviceAspectRatio' | 'minDeviceAspectRatio' | 'maxDeviceAspectRatio' | 'color' | 'minColor' | 'maxColor' | 'colorIndex' | 'minColorIndex' | 'maxColorIndex' | 'monochrome' | 'minMonochrome' | 'maxMonochrome' | 'resolution' | 'minResolution' | 'maxResolution' | 'scan' | 'grid' | 'orientation';
export declare type MediaQueryObject = {
    [key in mediaFetures]?: string | number;
};
export {};

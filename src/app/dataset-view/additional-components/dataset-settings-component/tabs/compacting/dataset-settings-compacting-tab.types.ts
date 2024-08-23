export enum SliceUnit {
    KB = "KB",
    MB = "MB",
    GB = "GB",
}

export const sliceSizeMapper: Record<SliceUnit, number> = {
    [SliceUnit.KB]: Math.pow(2, 10),
    [SliceUnit.MB]: Math.pow(2, 20),
    [SliceUnit.GB]: Math.pow(2, 30),
};

export function sliceSizeMapperReverse(sizeInBytes: number): { size: number; unit: SliceUnit } {
    if (sizeInBytes % Math.pow(2, 30) === 0) {
        return { size: sizeInBytes / Math.pow(2, 30), unit: SliceUnit.GB };
    } else if (sizeInBytes % Math.pow(2, 20) === 0) {
        return { size: sizeInBytes / Math.pow(2, 20), unit: SliceUnit.MB };
    } else {
        return { size: sizeInBytes / Math.pow(2, 10), unit: SliceUnit.KB };
    }
}

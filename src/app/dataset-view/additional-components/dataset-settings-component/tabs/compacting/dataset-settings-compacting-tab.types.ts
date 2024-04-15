export enum SliceUnit {
    B = "B",
    KB = "KB",
    MB = "MB",
    GB = "GB",
}

export const sliceSizeMapper: Record<SliceUnit, number> = {
    [SliceUnit.B]: 1,
    [SliceUnit.KB]: Math.pow(2, 10),
    [SliceUnit.MB]: Math.pow(2, 20),
    [SliceUnit.GB]: Math.pow(2, 30),
};

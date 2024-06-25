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

export enum CompactionMode {
    FULL = "Full",
    METADATA_ONLY = "MetadataOnly",
}

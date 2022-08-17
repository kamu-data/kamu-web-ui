export enum DatasetViewTypeEnum {
    overview = "overview",
    data = "data",
    metadata = "metadata",
    linage = "lineage",
    discussions = "discussions",
    history = "history",
}

export interface DatasetControlInterface {
    onSearchDataset: () => void;
    onSearchDataForDataset: () => void;
    onSearchMetadata: (currentPage: number) => void;
    onSearchDataForHistory: (currentPage: number) => void;
    onSearchLinageDataset: () => void;
    onSearchDiscussions: () => void;
}

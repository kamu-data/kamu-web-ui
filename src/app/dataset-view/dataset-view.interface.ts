export enum DatasetViewTypeEnum {
    overview = "overview",
    data = "data",
    metadata = "metadata",
    linage = "lineage",
    discussions = "discussions",
    history = "history",
}

export interface DatasetNavigationInterface {
    navigateToOverview: () => void;
    navigateToData: () => void;
    navigateToMetadata: (currentPage: number) => void;
    navigateToHistory: (currentPage: number) => void;
    navigateToLineage: () => void;
    navigateToDiscussions: () => void;
}

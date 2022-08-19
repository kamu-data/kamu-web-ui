export enum DatasetViewTypeEnum {
    Overview = "overview",
    Data = "data",
    Metadata = "metadata",
    Lineage = "lineage",
    Discussions = "discussions",
    History = "history",
}

export interface DatasetNavigationInterface {
    navigateToOverview: () => void;
    navigateToData: () => void;
    navigateToMetadata: (currentPage: number) => void;
    navigateToHistory: (currentPage: number) => void;
    navigateToLineage: () => void;
    navigateToDiscussions: () => void;
}

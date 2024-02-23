export interface DatasetNavigationParams {
    accountName: string;
    datasetName: string;
    tab?: string;
    page?: number;
    section?: string;
    state?: object;
}
export interface DatasetInfo {
    accountName: string;
    datasetName: string;
}

export interface MetadataBlockNavigationParams {
    accountName: string;
    datasetName: string;
    blockHash: string;
}

export interface FlowDetailsNavigationParams {
    accountName: string;
    datasetName: string;
    flowId: string;
}

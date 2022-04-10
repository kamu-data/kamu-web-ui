import {
    DatasetKind,
    DatasetMetadata,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";

export interface SearchHistoryResponseInterface {
    datasets: {
        __typename: string;
        byId: {
            __typename: string;
            data: {
                __typename: string;
                tail: {
                    __typename: string;
                    content: string;
                };
            };
        };
    };
}

export interface SearchResponse {
    data: SearchHistoryResponseInterface;
    loading: boolean;
    networkStatus: number;
}

export interface SearchHistoryInterface {
    province: string;
    reported_date: string;
    system_time: string;
    total_daily: number;
}

export interface SearchHistoryCurrentSchema {
    name: string;
    type: string;
    fields: [
        {
            name: string;
            repetition: string;
            type: string;
            logicalType: string;
        },
    ];
}

export interface SearchOverviewDatasetsInterface {
    id: string;
    name: string;
    owner: Account;
    kind: DatasetKind;
    metadata: DatasetMetadata;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface Account {
    id: string;
    name: string;
}
export interface SearchOverviewInterface {
    dataset: SearchOverviewDatasetsInterface[];
    totalCount: number | null | undefined;
    pageInfo: PageInfoInterface;
    currentPage: number;
}
export interface SearchMetadataInterface {
    id: string;
    name: string;
    owner: Account;
    pageInfo: PageInfoInterface;
    totalCount: number;
    currentPage: number;
    dataset: SearchOverviewDatasetsInterface[];
}

export interface DatasetKindInterface {
    id: string;
    name: string;
    kind: DatasetKind;
}

export interface PageInfoInterface {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalPages?: number | null | undefined;
    page?: number;
}

export interface DatasetIDsInterface {
    id: string;
    name: string;
    __typename: TypeNames;
}

export enum TypeNames {
    allDataType = "all",
    datasetType = "Dataset",
}

export interface SearchDataset {
    datasets: {
        __typename: string;
        byId: SearchDatasetByID;
    };
}

export interface SearchDatasetByID {
    __typename: string;
    createdAt: string;
    data: SearchDatasetByIDDataInterface;
    kind: DatasetKind;
    name: string;
    owner: Account;
    id: string;
    lastUpdatedAt: string;
    latestMetadataBlock?: MetadataBlockFragment;
    numBlocksTotal?: number;
    metadata: {
        _typename: string;
        currentInfo: {
            description: string;
            keywords: string[];
        };
        currentReadme: string;
        currentSchema: {
            _typename: string;
            content: SearchHistoryCurrentSchema[];
            format: string;
        };
        currentWatermark: string;
    };
}
export interface SearchMetadataNodeResponseInterface {
    blockHash: string;
    systemTime: string;
    event: any;
    eventType?: string;
}
export interface SearchDatasetByIDDataInterface {
    __typename: string;
    estimatedSize: number;
    numRecordsTotal: number;
    tail: {
        __typename: string;
        content: SearchHistoryInterface[];
        format: string;
    };
}
export interface DatasetNameInterface {
    id: string;
    name: string;
    owner: Account;
}
export interface DatasetInfoInterface {
    __typename: string;
    createdAt?: string;
    id: string;
    kind: DatasetKind;
    name: string;
    owner: {
        id: string;
        name: string;
    };
    lastUpdatedAt?: string;
    latestMetadataBlock?: MetadataBlockFragment;
    numBlocksTotal?: number;
    estimatedSize?: number;
    numRecordsTotal?: number;
    metadata: {
        _typename: string;
        currentInfo: {
            description: string;
            keywords: string[];
        };
        currentReadme: string;
        currentSchema: {
            _typename: string;
            content: SearchHistoryCurrentSchema[];
            format: string;
        };
        currentWatermark?: string;
    };
}
export interface DatasetLinageResponse {
    __typename: string;
    id: string;
    kind: DatasetKind;
    name: string;
    metadata: DatasetCurrentUpstreamDependencies;
}
export interface DatasetCurrentUpstreamDependencies {
    __typename: string;
    id: string;
    kind: DatasetKind;
    name: string;
    currentDownstreamDependencies?: DatasetLinageResponse[];
    currentUpstreamDependencies?: DatasetLinageResponse[];
}
export interface DataViewSchema {
    name: string;
    type: string;
    fields: Array<DataSchemaField>;
}
export interface DataSchemaField {
    name: string;
    repetition: string;
    type: string;
}

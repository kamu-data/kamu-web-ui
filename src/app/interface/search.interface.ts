import {
    Account,
    DatasetKind,
    DatasetMetadata,
    PageBasedInfo,
    Scalars,
} from "../api/kamu.graphql.interface";
import Maybe from "graphql/tsutils/Maybe";

export interface SearchHistoryInterface {
    province: string;
    reported_date: string;
    system_time: string;
    total_daily: number;
}

// Should be refactoring
export interface SearchOverviewDatasetsInterface {
    id: string;
    name: string;
    owner: Account;
    kind: DatasetKind;
    metadata: DatasetMetadata;
    createdAt: string;
    lastUpdatedAt: string;
}

// Should be refactoring
export interface SearchOverviewInterface {
    dataset: SearchOverviewDatasetsInterface[];
    totalCount: Maybe<Scalars["Int"]>;
    pageInfo: PageBasedInfo;
    currentPage: number;
}

export interface DatasetKindInterface {
    id: string;
    name: string;
    kind: DatasetKind;
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

export interface DatasetNameInterface {
    id: string;
    name: string;
    owner: Account;
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

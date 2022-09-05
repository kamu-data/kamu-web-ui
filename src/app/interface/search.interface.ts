import {
    DatasetBasicsFragment,
    DatasetSearchOverviewFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";

export interface DatasetSearchResult {
    datasets: DatasetSearchOverviewFragment[];
    totalCount: number;
    pageInfo: PageBasedInfo;
    currentPage: number;
}

export interface DatasetAutocompleteItem {
    dataset: DatasetBasicsFragment;
    __typename: TypeNames;
}

export enum TypeNames {
    allDataType = "all",
    datasetType = "Dataset",
}

export interface DatasetLineageNode {
    basics: DatasetBasicsFragment;
    downstreamDependencies: DatasetLineageNode[];
    upstreamDependencies: DatasetLineageNode[];
}

export interface DataViewSchema {
    name: string;
    type: string;
    fields: DataSchemaField[];
}

export interface DataSchemaField {
    name: string;
    repetition: string;
    type: string;
}

import {
    Dataset,
    DatasetKind,
    PageBasedInfo,
    Scalars,
} from "../api/kamu.graphql.interface";
import Maybe from "graphql/tsutils/Maybe";

export interface SearchOverviewInterface {
    datasets: Dataset[];
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

export interface DatasetLineageResponse {
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
    currentDownstreamDependencies?: DatasetLineageResponse[];
    currentUpstreamDependencies?: DatasetLineageResponse[];
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

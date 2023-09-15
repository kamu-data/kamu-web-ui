import { DatasetSearchOverviewFragment, PageBasedInfo } from "../api/kamu.graphql.interface";
import { DatasetLineageBasics } from "../dataset-view/dataset.subscriptions.interface";

export type DataRow = Record<string, string | number>;

export interface DatasetLineageNode {
    basics: DatasetLineageBasics;
    downstreamDependencies: DatasetLineageNode[];
    upstreamDependencies: DatasetLineageNode[];
}

export interface DatasetSchema {
    name: string;
    type: string;
    fields: DataSchemaField[];
}

export interface DataSchemaField {
    name: string;
    repetition: string;
    type: string;
    logical_type?: string;
}

export interface DatasetsAccountResponse {
    datasets: DatasetSearchOverviewFragment[];
    pageInfo: PageBasedInfo;
    datasetTotalCount: number;
}

export interface DatasetRequestBySql {
    query: string;
    limit?: number;
    skip?: number;
}

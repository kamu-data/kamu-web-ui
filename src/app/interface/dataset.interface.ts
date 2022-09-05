import { DatasetBasicsFragment } from "../api/kamu.graphql.interface";

export type DataRow = Record<string, string | number>;

export interface DatasetLineageNode {
    basics: DatasetBasicsFragment;
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
}

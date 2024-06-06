import { Dataset, FlowConnectionDataFragment } from "src/app/api/kamu.graphql.interface";

export enum FilterByInitiatorEnum {
    All = "All",
    System = "System",
    Account = "Account",
}

export interface FlowsTableData {
    connectionData: FlowConnectionDataFragment;
    flowOwners: Dataset[];
}

export interface TransformDescriptionTableData {
    numInputs: number;
    engine: string;
}

export interface CancelFlowArgs {
    flowId: string;
    datasetId: string;
}

export interface FlowsTableOptions {
    displayColumns: string[];
    initiatorsTypes: string[];
}

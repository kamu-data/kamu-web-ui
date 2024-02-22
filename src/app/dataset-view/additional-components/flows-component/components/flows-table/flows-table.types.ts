import { MaybeUndefined } from "src/app/common/app.types";
import { FetchStep, FlowConnectionDataFragment } from "src/app/api/kamu.graphql.interface";

export enum FilterByInitiatorEnum {
    All = "All",
    System = "System",
    Account = "Account",
}

export interface FlowsTableData {
    connectionData: FlowConnectionDataFragment;
    source: MaybeUndefined<FetchStep>;
    transformData: MaybeUndefined<TransformDescriptionTableData>;
}

export interface TransformDescriptionTableData {
    numInputs: number;
    engine: string;
}

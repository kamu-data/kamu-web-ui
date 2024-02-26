import {
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    FlowEvent,
    FlowSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";

export enum FlowDetailsTabs {
    SUMMARY = "summary",
    HISTORY = "history",
    LOGS = "logs",
    USAGE = "usage",
    ADMIN = "admin",
}

export interface DatasetFlowByIdResponse {
    flow: FlowSummaryDataFragment;
    flowHistory: FlowEvent[];
}
export interface ViewMenuData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
}

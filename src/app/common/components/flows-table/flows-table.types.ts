import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
import { Account, Dataset, FlowConnectionDataFragment } from "src/app/api/kamu.graphql.interface";

export enum FilterByInitiatorEnum {
    All = "All",
    System = "System",
}

export interface FlowsTableData {
    connectionData: FlowConnectionDataFragment;
    involvedDatasets: Dataset[];
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

export interface FlowsTableFiltersOptions {
    accounts: Account[];
    datasets: Dataset[];
}

export const dropdownSetting: DropdownSettings = {
    singleSelection: false,
    enableCheckAll: true,
    enableSearchFilter: true,
    badgeShowLimit: 1,
    enableFilterSelectAll: false,
    tagToBody: false,
    position: "bottom",
    autoPosition: false,
    maxHeight: 400,
};

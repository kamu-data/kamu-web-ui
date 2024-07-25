import { MaybeNull } from "src/app/common/app.types";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
import { Account, Dataset, FlowConnectionDataFragment, FlowStatus } from "src/app/api/kamu.graphql.interface";

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
}

export interface FlowsTableFiltersOptions {
    accounts: Account[];
    datasets: Dataset[];
    status: MaybeNull<FlowStatus>;
    onlySystemFlows: boolean;
}

export interface FilterStatusType {
    id: string;
    status: string;
}

const dropdownSetting: DropdownSettings = {
    enableCheckAll: true,
    enableSearchFilter: true,
    badgeShowLimit: 1,
    enableFilterSelectAll: false,
    tagToBody: false,
    position: "bottom",
    autoPosition: false,
    maxHeight: 400,
};

export const DROPDOWN_STATUS_SETTINGS: DropdownSettings = {
    labelKey: "status",
    text: "Filter by status",
    ...dropdownSetting,
    singleSelection: true,
    enableSearchFilter: false,
};

export const DROPDOWN_ACCOUNT_SETTINGS: DropdownSettings = {
    ...dropdownSetting,
    labelKey: "accountName",
    text: "Filter by initiator",
};

export const DROPDOWN_DATASET_SETTINGS: DropdownSettings = {
    labelKey: "name",
    text: "Filter by dataset",
    ...dropdownSetting,
};

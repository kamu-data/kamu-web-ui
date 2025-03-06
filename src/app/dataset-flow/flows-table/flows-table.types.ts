/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "src/app/interface/app.types";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
import {
    AccountFragment,
    DatasetListFlowsDataFragment,
    FlowConnectionDataFragment,
    FlowConnectionWidgetDataFragment,
    FlowStatus,
} from "src/app/api/kamu.graphql.interface";

export interface FlowsTableData {
    connectionDataForTable: FlowConnectionDataFragment;
    connectionDataForWidget: FlowConnectionWidgetDataFragment;
    involvedDatasets: DatasetListFlowsDataFragment[];
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
    accounts: AccountFragment[];
    datasets: DatasetListFlowsDataFragment[];
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

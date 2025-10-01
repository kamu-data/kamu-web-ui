/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    FlowProcessEffectiveState,
    FlowProcessGroupRollup,
} from "../api/kamu.graphql.interface";
import { MaybeNull } from "../interface/app.types";
import { OverviewUpdate } from "./dataset.subscriptions.interface";

export enum DatasetViewTypeEnum {
    Overview = "overview",
    Data = "data",
    Metadata = "metadata",
    Lineage = "lineage",
    Discussions = "discussions",
    History = "history",
    Settings = "settings",
    Flows = "flows",
}

export interface DatasetViewData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
}

export interface DatasetOverviewTabData extends DatasetViewData {
    overviewUpdate: OverviewUpdate;
}

export type FlowsSelectedCategory = "ALL" | "UPDATES_ONLY";
export type WebhooksSelectedCategory = "WEBHOOKS";

export interface WebhooksFiltersDescriptor {
    label: string;
    state: MaybeNull<FlowProcessEffectiveState>;
    valueKey: keyof FlowProcessGroupRollup;
}

export const WEBHOOKS_FILTERS_ITEMS: WebhooksFiltersDescriptor[] = [
    {
        label: "total:",
        state: null,
        valueKey: "total",
    },
    {
        label: "active:",
        state: FlowProcessEffectiveState.Active,
        valueKey: "active",
    },
    {
        label: "failing:",
        state: FlowProcessEffectiveState.Failing,
        valueKey: "failing",
    },
    // {
    //     label: "paused:",
    //     state: FlowProcessEffectiveState.PausedManual,
    //     valueKey: "paused",
    // },

    {
        label: "stopped:",
        state: FlowProcessEffectiveState.StoppedAuto,
        valueKey: "stopped",
    },
];

export const webhooksStateMapper: Record<FlowProcessEffectiveState, string> = {
    [FlowProcessEffectiveState.Active]: "ACTIVE",
    [FlowProcessEffectiveState.Failing]: "FAILING",
    [FlowProcessEffectiveState.PausedManual]: "PAUSED",
    [FlowProcessEffectiveState.StoppedAuto]: "STOPPED",
    [FlowProcessEffectiveState.Unconfigured]: "UNCONFIGURATED",
};

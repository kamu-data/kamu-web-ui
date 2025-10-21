/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe } from "@angular/common";
import {
    FlowProcessEffectiveState,
    FlowProcessSummary,
    FlowProcessAutoStopReason,
    FlowTriggerStopPolicyAfterConsecutiveFailures,
    AccountFragment,
    DatasetFlowProcesses,
    FlowProcessSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";

export type FlowsSelectedCategory = "all" | "updates";
export type WebhooksSelectedCategory = "webhooks";

export interface WebhooksFiltersDescriptor {
    label: string;
    state: FlowProcessEffectiveState;
    valueKey: "active" | "failing" | "paused" | "stopped" | "unconfigured";
}

export type FlowsCategoryUnion = FlowsSelectedCategory | WebhooksSelectedCategory;
export interface DatasetFlowsBadgeStyle {
    containerClass: string;
    iconClass: string;
    iconName: string;
}

export interface DatasetFlowsBadgeTexts {
    message: string;
    subMessage: string;
    additionalMessage?: string;
}

export interface FlowsSelectionState {
    flowsCategory?: FlowsSelectedCategory;
    webhooksCategory?: WebhooksSelectedCategory;
    webhookFilterButtons: FlowProcessEffectiveState[];
    webhooksIds: string[];
    subscriptions: string[];
}

export interface DatasetFlowsTabState {
    flowsData: FlowsTableData;
    flowInitiators: AccountFragment[];
    flowProcesses: DatasetFlowProcesses;
}

export const WebhooksFiltersOptions: WebhooksFiltersDescriptor[] = [
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
    {
        label: "paused:",
        state: FlowProcessEffectiveState.PausedManual,
        valueKey: "paused",
    },
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
    [FlowProcessEffectiveState.Unconfigured]: "UNCONFIGURED",
};

export class DatasetFlowBadgeHelpers {
    public static datePipe = new DatePipe("en-US");
    public static badgeStyles(effectiveState: FlowProcessEffectiveState): DatasetFlowsBadgeStyle {
        switch (effectiveState) {
            case FlowProcessEffectiveState.Unconfigured:
                return {
                    containerClass: "manual-container",
                    iconClass: "mannual-update-status",
                    iconName: "add_circle",
                };
            case FlowProcessEffectiveState.Active:
                return {
                    containerClass: "completed-container",
                    iconClass: "completed-status",
                    iconName: "check_circle",
                };
            case FlowProcessEffectiveState.Failing:
                return {
                    containerClass: "failing-container",
                    iconClass: "enabled-failing-status",
                    iconName: "warning",
                };
            case FlowProcessEffectiveState.PausedManual:
                return {
                    containerClass: "pause-container",
                    iconClass: "pause-status",
                    iconName: "pause_circle",
                };
            case FlowProcessEffectiveState.StoppedAuto:
                return {
                    containerClass: "stopped-container",
                    iconClass: "stopped-status",
                    iconName: "warning",
                };

            /* istanbul ignore next */
            default:
                throw new Error("Unsupported flow process effective state for styles");
        }
    }

    public static badgeMessages(summary: FlowProcessSummaryDataFragment, isRoot: boolean): DatasetFlowsBadgeTexts {
        switch (summary.effectiveState) {
            case FlowProcessEffectiveState.Unconfigured:
                return {
                    message: `Manual ${isRoot ? "ingest" : "transform"}`,
                    subMessage: "",
                };
            case FlowProcessEffectiveState.Active:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} active`,
                    subMessage: subMessagesActiveStateHelper(summary, isRoot),
                    additionalMessage: additionalMessagesActiveStateHelper(summary),
                };
            case FlowProcessEffectiveState.Failing:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} failing`,
                    subMessage: subMessagesFailingStateHelper(summary),
                    additionalMessage: `Last failure at: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`,
                };
            case FlowProcessEffectiveState.PausedManual:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} paused`,
                    subMessage: "Reason: paused manually by user",
                };

            case FlowProcessEffectiveState.StoppedAuto:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} stopped`,
                    subMessage: `Last run: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`,
                    additionalMessage: additionalMessagesStoppedAutoHelper(summary),
                };
            /* istanbul ignore next */
            default:
                throw new Error("Unsupported flow process effective state for messages");
        }
    }
}

function subMessagesFailingStateHelper(summary: FlowProcessSummaryDataFragment): string {
    switch (summary.stopPolicy.__typename) {
        case "FlowTriggerStopPolicyAfterConsecutiveFailures":
            return `Next planned: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.nextPlannedAt, AppValues.DISPLAY_TIME_FORMAT)}, ${summary.consecutiveFailures}/${summary.stopPolicy.maxFailures} consecutive failures`;
        case "FlowTriggerStopPolicyNever":
            return `${summary.consecutiveFailures} consecutive failures`;
        /* istanbul ignore next */
        default:
            return "";
    }
}

function subMessagesActiveStateHelper(summary: FlowProcessSummaryDataFragment, isRoot: boolean): string {
    if (summary.lastSuccessAt) {
        return `Last run: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastSuccessAt, AppValues.DISPLAY_TIME_FORMAT)}`;
    }
    if (!summary.lastSuccessAt && !summary.lastFailureAt) {
        return `${isRoot ? "Ingest" : "Transform"} running...`;
    }
    /* istanbul ignore next */
    return "";
}

function additionalMessagesActiveStateHelper(summary: FlowProcessSummary): string {
    if (summary.nextPlannedAt) {
        return `Next planned: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.nextPlannedAt, AppValues.DISPLAY_TIME_FORMAT)}`;
    } else {
        return "";
    }
}

function additionalMessagesStoppedAutoHelper(summary: FlowProcessSummaryDataFragment): string {
    if (summary.autoStoppedReason === FlowProcessAutoStopReason.StopPolicy) {
        return `Reason: stop policy ${summary.consecutiveFailures} consecutive failures - ${summary.consecutiveFailures}/${(summary.stopPolicy as FlowTriggerStopPolicyAfterConsecutiveFailures).maxFailures} consecutive failures`;
    }
    if (summary.autoStoppedReason === FlowProcessAutoStopReason.UnrecoverableFailure) {
        return `Reason: unrecoverable failure`;
    }
    /* istanbul ignore next */
    return "";
}

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe } from "@angular/common";
import {
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    DatasetFlowProcess,
    FlowProcessAutoStopReason,
    FlowProcessEffectiveState,
    FlowProcessGroupRollup,
    FlowProcessSummary,
    FlowTriggerStopPolicyAfterConsecutiveFailures,
} from "../api/kamu.graphql.interface";
import { MaybeNull } from "../interface/app.types";
import { OverviewUpdate } from "./dataset.subscriptions.interface";
import AppValues from "../common/values/app.values";

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

export type FlowsSelectedCategory = "all" | "updates";
export type WebhooksSelectedCategory = "webhooks";

export interface WebhooksFiltersDescriptor {
    label: string;
    state: MaybeNull<FlowProcessEffectiveState>;
    valueKey: keyof FlowProcessGroupRollup;
}

export const webhooksStateMapper: Record<FlowProcessEffectiveState, string> = {
    [FlowProcessEffectiveState.Active]: "ACTIVE",
    [FlowProcessEffectiveState.Failing]: "FAILING",
    [FlowProcessEffectiveState.PausedManual]: "PAUSED",
    [FlowProcessEffectiveState.StoppedAuto]: "STOPPED",
    [FlowProcessEffectiveState.Unconfigured]: "UNCONFIGURATED",
};

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

export class DatasetFlowBadgeHelpers {
    public static datePipe = new DatePipe("en-US");
    public static badgeStyles(flowProcess: DatasetFlowProcess): DatasetFlowsBadgeStyle {
        switch (flowProcess.summary.effectiveState) {
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

    public static badgeMessages(flowProcess: DatasetFlowProcess, isRoot: boolean): DatasetFlowsBadgeTexts {
        switch (flowProcess.summary.effectiveState) {
            case FlowProcessEffectiveState.Unconfigured:
                return {
                    message: `Manual ${isRoot ? "ingest" : "transform"}`,
                    subMessage: "Attempted to update the latest data",
                };
            case FlowProcessEffectiveState.Active:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} active`,
                    subMessage: subMessagesActiveStateHelper(flowProcess.summary, isRoot),
                    additionalMessage: additionalMessagesActiveStateHelper(flowProcess.summary),
                };
            case FlowProcessEffectiveState.Failing:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} failing`,
                    subMessage: subMessagesFailingStateHelper(flowProcess.summary),
                    additionalMessage: `Last failure at: ${DatasetFlowBadgeHelpers.datePipe.transform(flowProcess.summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`,
                };
            case FlowProcessEffectiveState.PausedManual:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} paused`,
                    subMessage: "Reason: paused manually by user",
                };

            case FlowProcessEffectiveState.StoppedAuto:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} stopped`,
                    subMessage: `Last run: ${DatasetFlowBadgeHelpers.datePipe.transform(flowProcess.summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`,
                    additionalMessage: additionalMessagesStoppedAutoHelper(flowProcess.summary),
                };
            default:
                throw new Error("Unsupported flow process effective state for messages");
        }
    }
}

function subMessagesFailingStateHelper(summary: FlowProcessSummary): string {
    switch (summary.stopPolicy.__typename) {
        case "FlowTriggerStopPolicyAfterConsecutiveFailures":
            return `Next planned: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.nextPlannedAt, AppValues.DISPLAY_TIME_FORMAT)}, ${summary.consecutiveFailures}/${summary.stopPolicy.maxFailures}`;
        case "FlowTriggerStopPolicyNever":
            return `${summary.consecutiveFailures} consecutive failures`;
        default:
            return "";
    }
}

function subMessagesActiveStateHelper(summary: FlowProcessSummary, isRoot: boolean): string {
    if (summary?.lastSuccessAt) {
        return `Last run: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastSuccessAt, AppValues.DISPLAY_TIME_FORMAT)}`;
    }
    if (!summary.lastSuccessAt && !summary.lastFailureAt) {
        return `${isRoot ? "Ingest" : "Transform"} starting...`;
    }
    return "";
}

function additionalMessagesActiveStateHelper(summary: FlowProcessSummary): string {
    if (summary.nextPlannedAt) {
        return `Next planned: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.nextPlannedAt, AppValues.DISPLAY_TIME_FORMAT)}`;
    } else {
        return "";
    }
}

function additionalMessagesStoppedAutoHelper(summary: FlowProcessSummary): string {
    if (summary?.autoStoppedReason && summary?.autoStoppedReason === FlowProcessAutoStopReason.StopPolicy) {
        return `Reason: stop policy ${summary.consecutiveFailures} consecutive failures - ${summary.consecutiveFailures}/${(summary.stopPolicy as FlowTriggerStopPolicyAfterConsecutiveFailures).maxFailures} consecutive failures`;
    }
    if (summary?.autoStoppedReason && summary?.autoStoppedReason === FlowProcessAutoStopReason.UnrecoverableFailure) {
        return `Reason: unrecoverable failure ${summary.stopPolicy.__typename === "FlowTriggerStopPolicyAfterConsecutiveFailures" ? "- " + summary.consecutiveFailures + "  consecutive failures" : ""}`;
    }
    return "";
}

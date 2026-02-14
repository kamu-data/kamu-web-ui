/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe } from "@angular/common";
import {
    ProcessCardFilterMode,
    RangeLastAttempt,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
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

export interface RollupFiltersDescriptor {
    label: string;
    state: FlowProcessEffectiveState;
    valueKey: "active" | "failing" | "paused" | "stopped" | "unconfigured";
    iconName?: string;
    iconClass?: string;
    allowedStates?: FlowProcessEffectiveState[];
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

export const RollupFiltersOptions: RollupFiltersDescriptor[] = [
    {
        label: "Active:",
        state: FlowProcessEffectiveState.Active,
        valueKey: "active",
        iconName: "check_circle",
        iconClass: "completed-status",
        allowedStates: [],
    },
    {
        label: "Failing:",
        state: FlowProcessEffectiveState.Failing,
        valueKey: "failing",
        iconName: "warning",
        iconClass: "enabled-failing-status",
        allowedStates: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.Active],
    },
    {
        label: "Paused:",
        state: FlowProcessEffectiveState.PausedManual,
        valueKey: "paused",
        iconName: "pause_circle",
        iconClass: "pause-status",
    },
    {
        label: "Stopped:",
        state: FlowProcessEffectiveState.StoppedAuto,
        valueKey: "stopped",
        iconName: "error",
        iconClass: "stopped-status",
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
                    iconName: "error",
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
                    subMessage: `Last failure at: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`,
                    additionalMessage: subMessagesFailingStateHelper(summary),
                };
            case FlowProcessEffectiveState.PausedManual:
                return {
                    message: `${isRoot ? "Ingest" : "Transform"} paused`,
                    subMessage: `Reason: paused manually by user at ${DatasetFlowBadgeHelpers.datePipe.transform(summary.pausedAt, AppValues.DISPLAY_TIME_FORMAT)}`,
                    additionalMessage: subMessagesPausedStateHelper(summary),
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

function subMessagesPausedStateHelper(summary: FlowProcessSummaryDataFragment): string {
    if (summary.lastFailureAt && summary.lastSuccessAt) {
        const lastFailureAtTime = new Date(summary.lastFailureAt).getTime();
        const lastSuccessAt = new Date(summary.lastSuccessAt).getTime();
        if (lastFailureAtTime > lastSuccessAt) {
            return `Last failure at: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`;
        } else {
            return `Last success at: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`;
        }
    }
    if (summary?.lastFailureAt) {
        return `Last failure at: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastFailureAt, AppValues.DISPLAY_TIME_FORMAT)}`;
    }
    if (summary?.lastSuccessAt) {
        return `Last success at: ${DatasetFlowBadgeHelpers.datePipe.transform(summary.lastSuccessAt, AppValues.DISPLAY_TIME_FORMAT)}`;
    }
    /* istanbul ignore next */
    return "";
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

export function lastTimeRangeHelper(selectedRange: RangeLastAttempt): Date {
    const today = new Date();
    switch (selectedRange) {
        case RangeLastAttempt.LAST_5_MINUTES: {
            today.setMinutes(today.getMinutes() - 5);
            return today;
        }
        case RangeLastAttempt.LAST_15_MINUTES: {
            today.setMinutes(today.getMinutes() - 15);
            return today;
        }
        case RangeLastAttempt.LAST_30_MINUTES: {
            today.setMinutes(today.getMinutes() - 30);
            return today;
        }
        case RangeLastAttempt.LAST_1_HOUR: {
            today.setHours(today.getHours() - 1);
            return today;
        }
        case RangeLastAttempt.LAST_3_HOURS: {
            today.setHours(today.getHours() - 3);
            return today;
        }
        case RangeLastAttempt.LAST_6_HOURS: {
            today.setHours(today.getHours() - 6);
            return today;
        }
        case RangeLastAttempt.LAST_12_HOURS: {
            today.setHours(today.getHours() - 12);
            return today;
        }
        case RangeLastAttempt.LAST_24_HOURS: {
            today.setHours(today.getHours() - 24);
            return today;
        }
        case RangeLastAttempt.LAST_2_DAYS: {
            today.setDate(today.getDate() - 2);
            return today;
        }
        case RangeLastAttempt.LAST_7_DAYS: {
            today.setDate(today.getDate() - 7);
            return today;
        }
        case RangeLastAttempt.LAST_30_DAYS: {
            today.setDate(today.getDate() - 30);
            return today;
        }
        case RangeLastAttempt.LAST_90_DAYS: {
            today.setDate(today.getDate() - 90);
            return today;
        }
        case RangeLastAttempt.LAST_6_MONTH: {
            today.setMonth(today.getMonth() - 6);
            return today;
        }
        case RangeLastAttempt.LAST_1_YEAR: {
            today.setFullYear(today.getFullYear() - 1);
            return today;
        }
        case RangeLastAttempt.LAST_2_YEAR: {
            today.setFullYear(today.getFullYear() - 2);
            return today;
        }
        /* istanbul ignore next */
        default:
            return new Date();
    }
}

export function nextTimeRangeHelper(selectedRange: RangeLastAttempt): Date {
    const today = new Date();
    switch (selectedRange) {
        case RangeLastAttempt.NEXT_5_MINUTES: {
            today.setMinutes(today.getMinutes() + 5);
            return today;
        }
        case RangeLastAttempt.NEXT_15_MINUTES: {
            today.setMinutes(today.getMinutes() + 15);
            return today;
        }
        case RangeLastAttempt.NEXT_30_MINUTES: {
            today.setMinutes(today.getMinutes() + 30);
            return today;
        }
        case RangeLastAttempt.NEXT_1_HOUR: {
            today.setHours(today.getHours() + 1);
            return today;
        }
        case RangeLastAttempt.NEXT_3_HOURS: {
            today.setHours(today.getHours() + 3);
            return today;
        }
        case RangeLastAttempt.NEXT_6_HOURS: {
            today.setHours(today.getHours() + 6);
            return today;
        }
        case RangeLastAttempt.NEXT_12_HOURS: {
            today.setHours(today.getHours() + 12);
            return today;
        }
        case RangeLastAttempt.NEXT_24_HOURS: {
            today.setHours(today.getHours() + 24);
            return today;
        }
        case RangeLastAttempt.NEXT_2_DAYS: {
            today.setDate(today.getDate() + 2);
            return today;
        }
        case RangeLastAttempt.NEXT_7_DAYS: {
            today.setDate(today.getDate() + 7);
            return today;
        }
        case RangeLastAttempt.NEXT_30_DAYS: {
            today.setDate(today.getDate() + 30);
            return today;
        }
        case RangeLastAttempt.NEXT_90_DAYS: {
            today.setDate(today.getDate() + 90);
            return today;
        }
        case RangeLastAttempt.NEXT_6_MONTH: {
            today.setMonth(today.getMonth() + 6);
            return today;
        }
        case RangeLastAttempt.NEXT_1_YEAR: {
            today.setFullYear(today.getFullYear() + 1);
            return today;
        }
        case RangeLastAttempt.NEXT_2_YEAR: {
            today.setFullYear(today.getFullYear() + 2);
            return today;
        }
        /* istanbul ignore next */
        default:
            return new Date();
    }
}

export function rollupAvailabilityMapper(mode: ProcessCardFilterMode, state: FlowProcessEffectiveState): boolean {
    switch (mode) {
        case ProcessCardFilterMode.RECENT_ACTIVITY:
            return [
                FlowProcessEffectiveState.Active,
                FlowProcessEffectiveState.Failing,
                FlowProcessEffectiveState.PausedManual,
                FlowProcessEffectiveState.StoppedAuto,
            ].includes(state);
        case ProcessCardFilterMode.TRIAGE:
            return [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto].includes(state);
        case ProcessCardFilterMode.PAUSED:
            return false;
        case ProcessCardFilterMode.UPCOMING_SCHEDULED:
            return [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing].includes(state);
        case ProcessCardFilterMode.CUSTOM:
            return [
                FlowProcessEffectiveState.Active,
                FlowProcessEffectiveState.Failing,
                FlowProcessEffectiveState.PausedManual,
                FlowProcessEffectiveState.StoppedAuto,
            ].includes(state);
        default:
            throw new Error("Unsupported process card view mode");
    }
}

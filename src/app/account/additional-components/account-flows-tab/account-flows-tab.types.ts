/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    FlowProcessEffectiveState,
    FlowProcessOrderField,
    OrderingDirection,
} from "src/app/api/kamu.graphql.interface";

export enum AccountFlowsNav {
    ACTIVITY = "activity",
    DATASETS = "datasets",
}

export enum ProcessCardFilterMode {
    RECENT_ACTIVITY = "recentActivity",
    TRIAGE = "triage",
    UPCOMING_SCHEDULED = "upcomingScheduled",
    PAUSED = "paused",
    CUSTOM = "custom",
}

export interface CardFilterDescriptor {
    label: string;
    value: ProcessCardFilterMode;
    iconName: string;
}

export const CARD_FILTERS_MODE_OPTIONS: CardFilterDescriptor[] = [
    {
        label: "Recent activity",
        value: ProcessCardFilterMode.RECENT_ACTIVITY,
        iconName: "history_2",
    },
    {
        label: "Triage",
        value: ProcessCardFilterMode.TRIAGE,
        iconName: "running_with_errors",
    },
    {
        label: "Upcoming scheduled",
        value: ProcessCardFilterMode.UPCOMING_SCHEDULED,
        iconName: "event_upcoming",
    },
    {
        label: "Paused",
        value: ProcessCardFilterMode.PAUSED,
        iconName: "motion_photos_paused",
    },
    {
        label: "Custom",
        value: ProcessCardFilterMode.CUSTOM,
        iconName: "tune",
    },
];

export interface OrderDirectionOption {
    id: number;
    label: string;
    value: OrderingDirection;
}

export interface OrderByFieldOption {
    id: number;
    label: string;
    value: FlowProcessOrderField;
}
export const ORDER_BY_FIELD_LIST_CUSTOM: OrderByFieldOption[] = [
    {
        id: 1,
        label: "Last attempt at",
        value: FlowProcessOrderField.LastAttemptAt,
    },
    {
        id: 2,
        label: "Next planned at",
        value: FlowProcessOrderField.NextPlannedAt,
    },
    {
        id: 3,
        label: "Last failure at",
        value: FlowProcessOrderField.LastFailureAt,
    },
    {
        id: 4,
        label: "Consecutive failures",
        value: FlowProcessOrderField.ConsecutiveFailures,
    },
    {
        id: 5,
        label: "Effective state",
        value: FlowProcessOrderField.EffectiveState,
    },
    {
        id: 6,
        label: "Flow type",
        value: FlowProcessOrderField.FlowType,
    },
];

export const ORDER_BY_FIELD_LIST_TRIAGE: OrderByFieldOption[] = [
    {
        id: 1,
        label: "Last failure at",
        value: FlowProcessOrderField.LastFailureAt,
    },
    {
        id: 2,
        label: "Consecutive failures",
        value: FlowProcessOrderField.ConsecutiveFailures,
    },
];

export const ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED: OrderByFieldOption[] = [
    {
        id: 1,
        label: "Next planned at",
        value: FlowProcessOrderField.NextPlannedAt,
    },
];

export interface ProcessFilterStateOption {
    id: number;
    label: string;
    value: FlowProcessEffectiveState;
}

export const FLOW_PROCESS_STATE_LIST: ProcessFilterStateOption[] = [
    {
        id: 1,
        label: "Active",
        value: FlowProcessEffectiveState.Active,
    },
    {
        id: 2,
        label: "Failing",
        value: FlowProcessEffectiveState.Failing,
    },
    {
        id: 3,
        label: "Paused",
        value: FlowProcessEffectiveState.PausedManual,
    },
    {
        id: 4,
        label: "Stopped",
        value: FlowProcessEffectiveState.StoppedAuto,
    },
];

export const FLOW_PROCESS_STATE_LIST_TRIAGE: ProcessFilterStateOption[] = [
    {
        id: 1,
        label: "Failing",
        value: FlowProcessEffectiveState.Failing,
    },

    {
        id: 2,
        label: "Stopped",
        value: FlowProcessEffectiveState.StoppedAuto,
    },
];

export const FLOW_PROCESS_STATE_LIST_UPCOMING: ProcessFilterStateOption[] = [
    {
        id: 1,
        label: "Active",
        value: FlowProcessEffectiveState.Active,
    },
    {
        id: 2,
        label: "Failing",
        value: FlowProcessEffectiveState.Failing,
    },
];

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountFlowProcessCard,
    AccountFlowProcessCardConnectionDataFragment,
    FlowProcessEffectiveState,
    FlowProcessGroupRollupDataFragment,
    FlowProcessOrderField,
    OrderingDirection,
} from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/interface/app.types";

export enum AccountFlowsNav {
    ACTIVITY = "activity",
    PROCESSES = "processes",
}

export enum ProcessCardFilterMode {
    RECENT_ACTIVITY = "recentActivity",
    TRIAGE = "triage",
    UPCOMING_SCHEDULED = "upcomingScheduled",
    PAUSED = "paused",
    CUSTOM = "custom",
}

export enum ProcessCardGroup {
    ALL = "all",
    DATASETS = "datasets",
    WEBHOOKS = "webhooks",
}

export enum RangeLastAttempt {
    LAST_5_MINUTES = "last5Minutes",
    LAST_15_MINUTES = "last15Minutes",
    LAST_30_MINUTES = "last30Minutes",
    LAST_1_HOUR = "last1Hour",
    LAST_3_HOURS = "last3Hours",
    LAST_6_HOURS = "last6Hours",
    LAST_12_HOURS = "last12Hours",
    LAST_24_HOURS = "last24Hours",
    LAST_2_DAYS = "last2Days",
    LAST_7_DAYS = "last7Days",
    LAST_30_DAYS = "last30Days",
    LAST_90_DAYS = "last90Days",
    LAST_6_MONTH = "last6Month",
    LAST_1_YEAR = "last1year",
    LAST_2_YEAR = "last2year",

    NEXT_5_MINUTES = "next5Minutes",
    NEXT_15_MINUTES = "next15Minutes",
    NEXT_30_MINUTES = "next30Minutes",
    NEXT_1_HOUR = "next1Hour",
    NEXT_3_HOURS = "next3Hours",
    NEXT_6_HOURS = "next6Hours",
    NEXT_12_HOURS = "next12Hours",
    NEXT_24_HOURS = "next24Hours",
    NEXT_2_DAYS = "next2Days",
    NEXT_7_DAYS = "next7Days",
    NEXT_30_DAYS = "next30Days",
    NEXT_90_DAYS = "next90Days",
    NEXT_6_MONTH = "next6Month",
    NEXT_1_YEAR = "next1year",
    NEXT_2_YEAR = "next2year",
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

export interface RangeLastAttemptOption {
    id: number;
    label: string;
    value: RangeLastAttempt;
}

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

export const RANGE_LAST_ATTEMPT_LIST: RangeLastAttemptOption[] = [
    {
        id: 1,
        label: "Last 5 minutes",
        value: RangeLastAttempt.LAST_5_MINUTES,
    },
    {
        id: 2,
        label: "Last 15 minutes",
        value: RangeLastAttempt.LAST_15_MINUTES,
    },
    {
        id: 3,
        label: "Last 30 minutes",
        value: RangeLastAttempt.LAST_30_MINUTES,
    },
    {
        id: 4,
        label: "Last 1 hour",
        value: RangeLastAttempt.LAST_1_HOUR,
    },
    {
        id: 5,
        label: "Last 3 hours",
        value: RangeLastAttempt.LAST_3_HOURS,
    },
    {
        id: 6,
        label: "Last 6 hours",
        value: RangeLastAttempt.LAST_6_HOURS,
    },
    {
        id: 7,
        label: "Last 12 hours",
        value: RangeLastAttempt.LAST_12_HOURS,
    },
    {
        id: 8,
        label: "Last 24 hours",
        value: RangeLastAttempt.LAST_24_HOURS,
    },
    {
        id: 9,
        label: "Last 2 days",
        value: RangeLastAttempt.LAST_2_DAYS,
    },
    {
        id: 10,
        label: "Last 7 days",
        value: RangeLastAttempt.LAST_7_DAYS,
    },
    {
        id: 11,
        label: "Last 30 days",
        value: RangeLastAttempt.LAST_30_DAYS,
    },
    {
        id: 12,
        label: "Last 90 days",
        value: RangeLastAttempt.LAST_90_DAYS,
    },
    {
        id: 13,
        label: "Last 6 months",
        value: RangeLastAttempt.LAST_6_MONTH,
    },
    {
        id: 14,
        label: "Last 1 year",
        value: RangeLastAttempt.LAST_1_YEAR,
    },
    {
        id: 15,
        label: "Last 2 years",
        value: RangeLastAttempt.LAST_2_YEAR,
    },
];

export const RANGE_NEXT_ATTEMPT_LIST: RangeLastAttemptOption[] = [
    {
        id: 1,
        label: "Next 5 minutes",
        value: RangeLastAttempt.NEXT_5_MINUTES,
    },
    {
        id: 2,
        label: "Next 15 minutes",
        value: RangeLastAttempt.NEXT_15_MINUTES,
    },
    {
        id: 3,
        label: "Next 30 minutes",
        value: RangeLastAttempt.NEXT_30_MINUTES,
    },
    {
        id: 4,
        label: "Next 1 hour",
        value: RangeLastAttempt.NEXT_1_HOUR,
    },
    {
        id: 5,
        label: "Next 3 hours",
        value: RangeLastAttempt.NEXT_3_HOURS,
    },
    {
        id: 6,
        label: "Next 6 hours",
        value: RangeLastAttempt.NEXT_6_HOURS,
    },
    {
        id: 7,
        label: "Next 12 hours",
        value: RangeLastAttempt.NEXT_12_HOURS,
    },
    {
        id: 8,
        label: "Next 24 hours",
        value: RangeLastAttempt.NEXT_24_HOURS,
    },
    {
        id: 9,
        label: "Next 2 days",
        value: RangeLastAttempt.NEXT_2_DAYS,
    },
    {
        id: 10,
        label: "Next 7 days",
        value: RangeLastAttempt.NEXT_7_DAYS,
    },
    {
        id: 11,
        label: "Next 30 days",
        value: RangeLastAttempt.NEXT_30_DAYS,
    },
    {
        id: 12,
        label: "Next 90 days",
        value: RangeLastAttempt.NEXT_90_DAYS,
    },
    {
        id: 13,
        label: "Next 6 months",
        value: RangeLastAttempt.NEXT_6_MONTH,
    },
    {
        id: 14,
        label: "Next 1 year",
        value: RangeLastAttempt.NEXT_1_YEAR,
    },
    {
        id: 15,
        label: "Next 2 years",
        value: RangeLastAttempt.NEXT_2_YEAR,
    },
];

export interface DashboardFiltersOptions {
    fromFilterDate: MaybeUndefined<Date>;
    toFilterDate: MaybeUndefined<Date>;
    lastFailureDate: MaybeUndefined<Date>;
    nextPlannedBeforeDate: MaybeUndefined<Date>;
    nextPlannedAfterDate: MaybeUndefined<Date>;
    selectedOrderDirection: boolean;
    selectedOrderField: MaybeUndefined<FlowProcessOrderField>;
    selectedQuickRangeLastAttempt: MaybeUndefined<string>;
    selectedQuickRangeLastFailure: MaybeUndefined<string>;
    selectedQuickRangeNextAttempt: MaybeUndefined<string>;
    selectedFlowProcessStates: FlowProcessEffectiveState[];
    minConsecutiveFailures: number;
    isFirstInitialization: boolean;
    applyFilters: boolean;
}

export interface FlowProcessCardListing {
    totalCount: number;
    nodes: AccountFlowProcessCard[];
}

export interface CardsStrategyResult {
    cards: AccountFlowProcessCardConnectionDataFragment;
    rollup: FlowProcessGroupRollupDataFragment;
}

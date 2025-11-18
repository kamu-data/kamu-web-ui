/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowProcessOrderField, OrderingDirection } from "src/app/api/kamu.graphql.interface";

export enum AccountFlowsNav {
    ACTIVITY = "activity",
    DATASETS = "datasets",
}

export enum ProcessCardFilterMode {
    RECENT_ACTIVITY = "recentActivity",
    TRIAGE = "triage",
    UPCOMING_SCHEDULED = "upcomingScheduled",
    ADVANCED = "advanced",
}

export interface CardFilterDescriptor {
    label: string;
    value: ProcessCardFilterMode;
}

export const CARD_FILTERS_MODE_OPTIONS: CardFilterDescriptor[] = [
    {
        label: "Recent activity",
        value: ProcessCardFilterMode.RECENT_ACTIVITY,
    },
    {
        label: "Triage",
        value: ProcessCardFilterMode.TRIAGE,
    },
    {
        label: "Upcoming scheduled",
        value: ProcessCardFilterMode.UPCOMING_SCHEDULED,
    },
    {
        label: "Advanced",
        value: ProcessCardFilterMode.ADVANCED,
    },
];

export interface OrderDirectionOption {
    id: number;
    label: string;
    value: OrderingDirection;
}

export const ORDER_DIRECTION_LIST = [
    {
        id: 1,
        label: "ASC",
        value: OrderingDirection.Asc,
    },
    {
        id: 2,
        label: "DESC",
        value: OrderingDirection.Desc,
    },
];

export interface OrderByFieldOption {
    id: number;
    label: string;
    value: FlowProcessOrderField;
}
export const ORDER_BY_FIELD_LIST: OrderByFieldOption[] = [
    {
        id: 1,
        label: "Last attempt",
        value: FlowProcessOrderField.LastAttemptAt,
    },
    {
        id: 2,
        label: "Next planned",
        value: FlowProcessOrderField.NextPlannedAt,
    },
    {
        id: 3,
        label: "Last failure",
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

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { RangeLastAttempt } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import {
    DatasetFlowBadgeHelpers,
    DatasetFlowsBadgeStyle,
    DatasetFlowsBadgeTexts,
    lastTimeRangeHelper,
    nextTimeRangeHelper,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import timekeeper from "timekeeper";

import {
    FlowProcessAutoStopReason,
    FlowProcessEffectiveState,
    FlowProcessSummaryDataFragment,
} from "@api/kamu.graphql.interface";
import {
    mockFlowProcessSummaryDataFragment,
    mockFlowProcessSummaryDataFragmentNoPolicy,
} from "@api/mock/dataset-flow.mock";

describe("Flows badge styles helper", () => {
    [
        {
            case: FlowProcessEffectiveState.Active,
            expectedResult: {
                containerClass: "completed-container",
                iconClass: "completed-status",
                iconName: "check_circle",
            },
        },
        {
            case: FlowProcessEffectiveState.Unconfigured,
            expectedResult: {
                containerClass: "manual-container",
                iconClass: "mannual-update-status",
                iconName: "add_circle",
            },
        },
        {
            case: FlowProcessEffectiveState.PausedManual,
            expectedResult: {
                containerClass: "pause-container",
                iconClass: "pause-status",
                iconName: "pause_circle",
            },
        },
        {
            case: FlowProcessEffectiveState.StoppedAuto,
            expectedResult: {
                containerClass: "stopped-container",
                iconClass: "stopped-status",
                iconName: "error",
            },
        },
        {
            case: FlowProcessEffectiveState.Failing,
            expectedResult: {
                containerClass: "failing-container",
                iconClass: "enabled-failing-status",
                iconName: "warning",
            },
        },
    ].forEach((item: { case: FlowProcessEffectiveState; expectedResult: DatasetFlowsBadgeStyle }) => {
        it(`should check badgeStyles for ${item.case}`, () => {
            expect(DatasetFlowBadgeHelpers.badgeStyles(item.case)).toEqual(item.expectedResult);
        });
    });
});

describe("Flows badge messages helper", () => {
    beforeAll(() => {
        const FROZEN_TIME = new Date("2025-12-02 12:00:00");
        timekeeper.freeze(FROZEN_TIME);
    });

    [
        {
            case: {
                summary: mockFlowProcessSummaryDataFragment,
                isRoot: true,
            },
            expectedResult: {
                message: "Ingest active",
                subMessage: "Last run: 2025-10-13, 7:53:08 PM",
                additionalMessage: "Next planned: 2025-10-13, 7:55:08 PM",
            },
        },
        {
            case: {
                summary: mockFlowProcessSummaryDataFragment,
                isRoot: false,
            },
            expectedResult: {
                message: "Transform active",
                subMessage: "Last run: 2025-10-13, 7:53:08 PM",
                additionalMessage: "Next planned: 2025-10-13, 7:55:08 PM",
            },
        },
        {
            case: {
                summary: { ...mockFlowProcessSummaryDataFragment, lastSuccessAt: undefined, lastFailureAt: undefined },
                isRoot: true,
            },
            expectedResult: {
                message: "Ingest active",
                subMessage: "Ingest running...",
                additionalMessage: "Next planned: 2025-10-13, 7:55:08 PM",
            },
        },
        {
            case: {
                summary: { ...mockFlowProcessSummaryDataFragment, lastSuccessAt: undefined, lastFailureAt: undefined },
                isRoot: false,
            },
            expectedResult: {
                message: "Transform active",
                subMessage: "Transform running...",
                additionalMessage: "Next planned: 2025-10-13, 7:55:08 PM",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.Unconfigured,
                },
                isRoot: true,
            },
            expectedResult: {
                message: "Manual ingest",
                subMessage: "",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.Unconfigured,
                },
                isRoot: false,
            },
            expectedResult: {
                message: "Manual transform",
                subMessage: "",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.Failing,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 1,
                },
                isRoot: true,
            },
            expectedResult: {
                message: "Ingest failing",
                subMessage: "Last failure at: 2025-10-13, 4:29:36 PM",
                additionalMessage: "Next planned: 2025-10-13, 7:55:08 PM, 1/1 consecutive failures",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.Failing,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 1,
                },
                isRoot: false,
            },
            expectedResult: {
                message: "Transform failing",
                subMessage: "Last failure at: 2025-10-13, 4:29:36 PM",
                additionalMessage: "Next planned: 2025-10-13, 7:55:08 PM, 1/1 consecutive failures",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragmentNoPolicy,
                    effectiveState: FlowProcessEffectiveState.Failing,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 1,
                },
                isRoot: true,
            },
            expectedResult: {
                message: "Ingest failing",
                subMessage: "Last failure at: 2025-10-13, 4:29:36 PM",
                additionalMessage: "1 consecutive failures",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.PausedManual,
                },
                isRoot: true,
            },
            expectedResult: {
                message: "Ingest paused",
                subMessage: "Reason: paused manually by user at 2025-10-13, 7:53:08 PM",
                additionalMessage: "Last success at: 2025-10-13, 7:53:08 PM",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.PausedManual,
                },
                isRoot: false,
            },
            expectedResult: {
                message: "Transform paused",
                subMessage: "Reason: paused manually by user at 2025-10-13, 7:53:08 PM",
                additionalMessage: "Last success at: 2025-10-13, 7:53:08 PM",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.StoppedAuto,
                    autoStoppedReason: FlowProcessAutoStopReason.StopPolicy,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 2,
                    stopPolicy: {
                        maxFailures: 2,
                    },
                },
                isRoot: true,
            },
            expectedResult: {
                message: "Ingest stopped",
                subMessage: "Last run: 2025-10-13, 4:29:36 PM",
                additionalMessage: "Reason: stop policy 2 consecutive failures - 2/2 consecutive failures",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.StoppedAuto,
                    autoStoppedReason: FlowProcessAutoStopReason.StopPolicy,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 2,
                    stopPolicy: {
                        maxFailures: 2,
                    },
                },
                isRoot: false,
            },
            expectedResult: {
                message: "Transform stopped",
                subMessage: "Last run: 2025-10-13, 4:29:36 PM",
                additionalMessage: "Reason: stop policy 2 consecutive failures - 2/2 consecutive failures",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragment,
                    effectiveState: FlowProcessEffectiveState.StoppedAuto,
                    autoStoppedReason: FlowProcessAutoStopReason.UnrecoverableFailure,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 2,
                },
                isRoot: false,
            },
            expectedResult: {
                message: "Transform stopped",
                subMessage: "Last run: 2025-10-13, 4:29:36 PM",
                additionalMessage: "Reason: unrecoverable failure",
            },
        },
        {
            case: {
                summary: {
                    ...mockFlowProcessSummaryDataFragmentNoPolicy,
                    effectiveState: FlowProcessEffectiveState.StoppedAuto,
                    autoStoppedReason: FlowProcessAutoStopReason.UnrecoverableFailure,
                    lastFailureAt: "2025-10-13T13:29:36.582575289+00:00",
                    consecutiveFailures: 2,
                },
                isRoot: false,
            },
            expectedResult: {
                message: "Transform stopped",
                subMessage: "Last run: 2025-10-13, 4:29:36 PM",
                additionalMessage: "Reason: unrecoverable failure",
            },
        },
    ].forEach(
        (item: {
            case: {
                summary: FlowProcessSummaryDataFragment;
                isRoot: boolean;
            };
            expectedResult: DatasetFlowsBadgeTexts;
        }) => {
            it(`should check mesages for ${item.case.summary.effectiveState}`, () => {
                expect(DatasetFlowBadgeHelpers.badgeMessages(item.case.summary, item.case.isRoot)).toEqual(
                    item.expectedResult,
                );
            });
        },
    );
});

describe("nextTimeRangeHelper helper", () => {
    beforeAll(() => {
        const FROZEN_TIME = new Date("2025-12-02 12:00:00");
        timekeeper.freeze(FROZEN_TIME);
    });

    [
        {
            case: RangeLastAttempt.NEXT_5_MINUTES,
            expectedResult: new Date("2025-12-02 12:05:00"),
        },
        {
            case: RangeLastAttempt.NEXT_15_MINUTES,
            expectedResult: new Date("2025-12-02 12:15:00"),
        },
        {
            case: RangeLastAttempt.NEXT_30_MINUTES,
            expectedResult: new Date("2025-12-02 12:30:00"),
        },
        {
            case: RangeLastAttempt.NEXT_1_HOUR,
            expectedResult: new Date("2025-12-02 13:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_3_HOURS,
            expectedResult: new Date("2025-12-02 15:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_6_HOURS,
            expectedResult: new Date("2025-12-02 18:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_12_HOURS,
            expectedResult: new Date("2025-12-03 00:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_24_HOURS,
            expectedResult: new Date("2025-12-03 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_2_DAYS,
            expectedResult: new Date("2025-12-4 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_7_DAYS,
            expectedResult: new Date("2025-12-09 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_30_DAYS,
            expectedResult: new Date("2026-01-01 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_90_DAYS,
            expectedResult: new Date("2026-03-02 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_6_MONTH,
            expectedResult: new Date("2026-06-02 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_1_YEAR,
            expectedResult: new Date("2026-12-02 12:00:00"),
        },
        {
            case: RangeLastAttempt.NEXT_2_YEAR,
            expectedResult: new Date("2027-12-02 12:00:00"),
        },
    ].forEach((item: { case: RangeLastAttempt; expectedResult: Date }) => {
        it(`should check date for ${item.case}`, () => {
            expect(nextTimeRangeHelper(item.case)).toEqual(item.expectedResult);
        });
    });
});

describe("lastTimeRangeHelper helper", () => {
    beforeAll(() => {
        const FROZEN_TIME = new Date("2025-12-02 12:00:00");
        timekeeper.freeze(FROZEN_TIME);
    });

    [
        {
            case: RangeLastAttempt.LAST_5_MINUTES,
            expectedResult: new Date("2025-12-02 11:55:00"),
        },
        {
            case: RangeLastAttempt.LAST_15_MINUTES,
            expectedResult: new Date("2025-12-02 11:45:00"),
        },
        {
            case: RangeLastAttempt.LAST_30_MINUTES,
            expectedResult: new Date("2025-12-02 11:30:00"),
        },
        {
            case: RangeLastAttempt.LAST_1_HOUR,
            expectedResult: new Date("2025-12-02 11:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_3_HOURS,
            expectedResult: new Date("2025-12-02 09:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_6_HOURS,
            expectedResult: new Date("2025-12-02 06:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_12_HOURS,
            expectedResult: new Date("2025-12-02 00:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_24_HOURS,
            expectedResult: new Date("2025-12-01 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_2_DAYS,
            expectedResult: new Date("2025-11-30 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_7_DAYS,
            expectedResult: new Date("2025-11-25 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_30_DAYS,
            expectedResult: new Date("2025-11-02 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_90_DAYS,
            expectedResult: new Date("2025-09-03 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_6_MONTH,
            expectedResult: new Date("2025-06-02 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_1_YEAR,
            expectedResult: new Date("2024-12-02 12:00:00"),
        },
        {
            case: RangeLastAttempt.LAST_2_YEAR,
            expectedResult: new Date("2023-12-02 12:00:00"),
        },
    ].forEach((item: { case: RangeLastAttempt; expectedResult: Date }) => {
        it(`should check date for ${item.case}`, () => {
            expect(lastTimeRangeHelper(item.case)).toEqual(item.expectedResult);
        });
    });
});

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    FlowProcessAutoStopReason,
    FlowProcessEffectiveState,
    FlowProcessSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowBadgeHelpers, DatasetFlowsBadgeStyle, DatasetFlowsBadgeTexts } from "./flows.helpers";
import {
    mockFlowProcessSummaryDataFragment,
    mockFlowProcessSummaryDataFragmentNoPolicy,
} from "src/app/api/mock/dataset-flow.mock";

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
                iconName: "warning",
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
                subMessage: "Ingest starting...",
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
                subMessage: "Transform starting...",
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
                subMessage: "Next planned: 2025-10-13, 7:55:08 PM, 1/1 consecutive failures",
                additionalMessage: "Last failure at: 2025-10-13, 4:29:36 PM",
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
                subMessage: "Next planned: 2025-10-13, 7:55:08 PM, 1/1 consecutive failures",
                additionalMessage: "Last failure at: 2025-10-13, 4:29:36 PM",
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
                subMessage: "1 consecutive failures",
                additionalMessage: "Last failure at: 2025-10-13, 4:29:36 PM",
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
                subMessage: "Reason: paused manually by user",
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
                subMessage: "Reason: paused manually by user",
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
                additionalMessage: "Reason: unrecoverable failure - 2  consecutive failures",
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
                additionalMessage: "Reason: unrecoverable failure ",
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

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DashboardFiltersOptions } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";

/** A new object on each call, since the filter views write into the one they are given */
export function mockDashboardFilters(overrides: Partial<DashboardFiltersOptions> = {}): DashboardFiltersOptions {
    return {
        fromFilterDate: undefined,
        toFilterDate: undefined,
        lastFailureDate: undefined,
        nextPlannedBeforeDate: undefined,
        nextPlannedAfterDate: undefined,
        selectedOrderDirection: true,
        selectedOrderField: undefined,
        selectedQuickRangeLastAttempt: undefined,
        selectedQuickRangeLastFailure: undefined,
        selectedQuickRangeNextAttempt: undefined,
        selectedFlowProcessStates: [],
        minConsecutiveFailures: 0,
        isFirstInitialization: false,
        ...overrides,
    };
}

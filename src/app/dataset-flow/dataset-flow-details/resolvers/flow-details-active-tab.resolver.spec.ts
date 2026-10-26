/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { flowDetailsActiveTabResolverFn } from "src/app/dataset-flow/dataset-flow-details/resolvers/flow-details-active-tab.resolver";
import ProjectLinks from "src/app/project-links";

describe("flowDetailsActiveTabResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    [
        FlowDetailsTabs.SUMMARY,
        FlowDetailsTabs.HISTORY,
        FlowDetailsTabs.LOGS,
        FlowDetailsTabs.USAGE,
        FlowDetailsTabs.ADMIN,
    ].forEach((tab) => {
        it(`should return the ${tab} tab from the first child route`, async () => {
            const route = routeSnapshot({
                children: [routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: tab } })],
            });

            expect(await runResolver(flowDetailsActiveTabResolverFn, route)).toBe(tab);
        });
    });

    describe("should return null when no tab data is available", () => {
        [
            {
                description: "route has no children",
                route: routeSnapshot(),
            },
            {
                description: "first child data has no tab parameter",
                route: routeSnapshot({ children: [routeSnapshot()] }),
            },
            {
                description: "first child tab is null",
                route: routeSnapshot({
                    children: [routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: null } })],
                }),
            },
        ].forEach(({ description, route }) => {
            it(`when ${description}`, async () => {
                expect(await runResolver(flowDetailsActiveTabResolverFn, route)).toBeNull();
            });
        });
    });
});

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Data, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { flowDetailsActiveTabResolverFn } from "./flow-details-active-tab.resolver";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";

describe("flowDetailsActiveTabResolverFn", () => {
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<FlowDetailsTabs | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should return correct tab for different flow details tabs", () => {
        const testCases = [
            { tab: FlowDetailsTabs.SUMMARY },
            { tab: FlowDetailsTabs.HISTORY },
            { tab: FlowDetailsTabs.LOGS },
            { tab: FlowDetailsTabs.USAGE },
            { tab: FlowDetailsTabs.ADMIN },
        ];

        testCases.forEach(({ tab }) => {
            const mockRoute = {
                children: [
                    {
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: tab,
                        } as Data,
                    },
                ],
            } as ActivatedRouteSnapshot;

            const result = executeResolver(mockRoute, mockState);

            expect(result).toBe(tab);
        });
    });

    describe("should return null when no tab data is available", () => {
        const testCases = [
            {
                description: "route has no children",
                mockRoute: {
                    children: [],
                } as unknown as ActivatedRouteSnapshot,
            },
            {
                description: "children array is undefined",
                mockRoute: {} as unknown as ActivatedRouteSnapshot,
            },
            {
                description: "first child has no data",
                mockRoute: {
                    children: [{}],
                } as unknown as ActivatedRouteSnapshot,
            },
            {
                description: "first child data has no tab parameter",
                mockRoute: {
                    children: [
                        {
                            data: {} as Data,
                        },
                    ],
                } as unknown as ActivatedRouteSnapshot,
            },
            {
                description: "first child data is null",
                mockRoute: {
                    children: [
                        {
                            data: {
                                [ProjectLinks.URL_PARAM_TAB]: null,
                            } as Data,
                        },
                    ],
                } as unknown as ActivatedRouteSnapshot,
            },
        ];

        testCases.forEach(({ description, mockRoute }) => {
            it(`when ${description}`, () => {
                const result = executeResolver(mockRoute, mockState);
                expect(result).toBeNull();
            });
        });
    });
});
